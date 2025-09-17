import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { HiPlus, HiX, HiPencil, HiCheck, HiStar, HiLightningBolt } from "react-icons/hi";
import { getGoalsAndSkills, updateGoalsAndSkills } from "./api";
import { toast } from "react-toastify";

const GoalsSkillsDemo: NextPage = () => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Goals & Skills Demo</h1>
          <p className="text-lg text-gray-600">Manage your personal goals and professional skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <HiStar className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {goals.length}/10
              </span>
            </div>
            
            {/* Add Goal Input */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a goal..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                maxLength={100}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <button
                onClick={addGoal}
                disabled={!newGoal.trim() || goals.length >= 10}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>Add</span>
              </button>
            </div>

            {/* Goals List */}
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  {editingGoal === index ? (
                    <>
                      <input
                        type="text"
                        value={editGoalValue}
                        onChange={(e) => setEditGoalValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        maxLength={100}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedGoal()}
                        autoFocus
                      />
                      <button
                        onClick={saveEditedGoal}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <HiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <HiX className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-600 font-medium">•</span>
                      <span className="flex-1 text-gray-900">{goal}</span>
                      <button
                        onClick={() => startEditingGoal(index)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeGoal(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {goals.length === 0 && (
              <div className="text-center py-8">
                <HiStar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No goals added yet. Add your first goal above!</p>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <HiLightningBolt className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {skills.length}/20
              </span>
            </div>
            
            {/* Add Skill Input */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim() || skills.length >= 20}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>Add</span>
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {editingSkill === index ? (
                    <>
                      <input
                        type="text"
                        value={editSkillValue}
                        onChange={(e) => setEditSkillValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={50}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedSkill()}
                        autoFocus
                      />
                      <button
                        onClick={saveEditedSkill}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <HiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <HiX className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {skill}
                      </span>
                      <button
                        onClick={() => startEditingSkill(index)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {skills.length === 0 && (
              <div className="text-center py-8">
                <HiLightningBolt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No skills added yet. Add your first skill above!</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={saveGoalsAndSkills}
            disabled={saving}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <HiCheck className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Features Overview */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Features Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiStar className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Goals Management</h4>
              <p className="text-gray-600">Set and track up to 10 personal or professional goals with easy editing and management.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiLightningBolt className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Skills Showcase</h4>
              <p className="text-gray-600">Display up to 20 skills in an organized, tag-based format for easy visibility.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-gray-600">Changes are saved instantly and reflected across your profile and dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsSkillsDemo;
