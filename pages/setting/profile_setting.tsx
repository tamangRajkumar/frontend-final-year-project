import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { HiPlus, HiX, HiPencil, HiCheck } from "react-icons/hi";
import SidebarSettingOptions from "../../src/components/setting/SidebarSettingOptions";
import { getGoalsAndSkills, updateGoalsAndSkills } from "../api";

const ProfileSetting: NextPage = () => {
  const [goals, setGoals] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<number | null>(null);
  const [editGoalValue, setEditGoalValue] = useState("");
  const [editSkillValue, setEditSkillValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (!token || !currentUser) {
      router.push("/auth/login");
      return;
    }
    fetchGoalsAndSkills();
  }, [token, currentUser, router]);

  const fetchGoalsAndSkills = async () => {
    try {
      setLoading(true);
      const { data } = await getGoalsAndSkills(token);
      if (data.success) {
        setGoals(data.data.goals || []);
        setSkills(data.data.skills || []);
      }
    } catch (error) {
      console.error("Error fetching goals and skills:", error);
      toast.error("Failed to fetch goals and skills");
    } finally {
      setLoading(false);
    }
  };

  const saveGoalsAndSkills = async () => {
    try {
      setSaving(true);
      const { data } = await updateGoalsAndSkills(goals, skills, token);
      if (data.success) {
        toast.success("Goals and skills updated successfully!");
      }
    } catch (error) {
      console.error("Error updating goals and skills:", error);
      toast.error("Failed to update goals and skills");
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && goals.length < 10) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    } else if (goals.length >= 10) {
      toast.error("Maximum 10 goals allowed");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && skills.length < 20) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    } else if (skills.length >= 20) {
      toast.error("Maximum 20 skills allowed");
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const startEditingGoal = (index: number) => {
    setEditingGoal(index);
    setEditGoalValue(goals[index]);
  };

  const startEditingSkill = (index: number) => {
    setEditingSkill(index);
    setEditSkillValue(skills[index]);
  };

  const saveEditedGoal = () => {
    if (editGoalValue.trim()) {
      const updatedGoals = [...goals];
      updatedGoals[editingGoal!] = editGoalValue.trim();
      setGoals(updatedGoals);
    }
    setEditingGoal(null);
    setEditGoalValue("");
  };

  const saveEditedSkill = () => {
    if (editSkillValue.trim()) {
      const updatedSkills = [...skills];
      updatedSkills[editingSkill!] = editSkillValue.trim();
      setSkills(updatedSkills);
    }
    setEditingSkill(null);
    setEditSkillValue("");
  };

  const cancelEditing = () => {
    setEditingGoal(null);
    setEditingSkill(null);
    setEditGoalValue("");
    setEditSkillValue("");
  };

  if (loading) {
    return (
      <div className="flex px-20 h-[100vh] bg-white">
        <SidebarSettingOptions />
        <div className="ml-16 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex px-20 h-[100vh] bg-white">
      {/* Sidebar Setting Options */}
      <SidebarSettingOptions />

      {/* Main Content */}
      <div className="ml-16 flex-grow mt-20 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your personal information, goals, and skills</p>
          </div>

          {/* Basic Info Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <p className="font-semibold text-lg w-32">Name</p>
                  <p className="font-medium text-base">{currentUser?.fname} {currentUser?.lname}</p>
                </div>
                <button className="px-3 py-1 bg-gray-300 rounded-lg text-sm font-normal hover:bg-gray-400 transition-colors">
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex">
                  <p className="font-semibold text-lg w-32">Country</p>
                  <p className="font-medium text-base">{currentUser?.country}</p>
                </div>
                <button className="px-3 py-1 bg-gray-300 rounded-lg text-sm font-normal hover:bg-gray-400 transition-colors">
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex">
                  <p className="font-semibold text-lg w-32">Gender</p>
                  <p className="font-medium text-base">{currentUser?.gender}</p>
                </div>
                <button className="px-3 py-1 bg-gray-300 rounded-lg text-sm font-normal hover:bg-gray-400 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Goals</h2>
              <span className="text-sm text-gray-500">{goals.length}/10</span>
            </div>
            
            {/* Add Goal Input */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a goal..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <button
                onClick={addGoal}
                disabled={!newGoal.trim() || goals.length >= 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <HiPlus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Goals List */}
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  {editingGoal === index ? (
                    <>
                      <input
                        type="text"
                        value={editGoalValue}
                        onChange={(e) => setEditGoalValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={100}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedGoal()}
                        autoFocus
                      />
                      <button
                        onClick={saveEditedGoal}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <HiCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900">{goal}</span>
                      <button
                        onClick={() => startEditingGoal(index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeGoal(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {goals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No goals added yet. Add your first goal above!</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              <span className="text-sm text-gray-500">{skills.length}/20</span>
            </div>
            
            {/* Add Skill Input */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim() || skills.length >= 20}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <HiPlus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  {editingSkill === index ? (
                    <>
                      <input
                        type="text"
                        value={editSkillValue}
                        onChange={(e) => setEditSkillValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={50}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedSkill()}
                        autoFocus
                      />
                      <button
                        onClick={saveEditedSkill}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <HiCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900">{skill}</span>
                      <button
                        onClick={() => startEditingSkill(index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {skills.length === 0 && (
              <p className="text-gray-500 text-center py-4">No skills added yet. Add your first skill above!</p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveGoalsAndSkills}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
