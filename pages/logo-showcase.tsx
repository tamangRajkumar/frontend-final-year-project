import React from 'react';
import { NextPage } from 'next';
import ModernLogo from '../src/components/headerFooter/ModernLogo';
import MinimalistLogo from '../src/components/headerFooter/MinimalistLogo';
import ProfessionalLogo from '../src/components/headerFooter/ProfessionalLogo';
import Logo from '../src/components/headerFooter/Logo';

const LogoShowcase: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Logo Redesign Showcase</h1>
          <p className="text-lg text-gray-600">Modern, sleek, and professional logo variations for LinkCofounders</p>
        </div>

        {/* Current Logo */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Logo</h2>
          <div className="flex items-center justify-center space-x-8">
            <Logo size={48} />
            <Logo size={64} />
            <Logo size={80} />
          </div>
        </div>

        {/* Modern Logo Variants */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Modern Logo</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Full Variant</h3>
              <div className="flex items-center justify-center space-x-8">
                <ModernLogo size={48} variant="full" />
                <ModernLogo size={64} variant="full" />
                <ModernLogo size={80} variant="full" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Icon Only</h3>
              <div className="flex items-center justify-center space-x-8">
                <ModernLogo size={48} variant="icon" />
                <ModernLogo size={64} variant="icon" />
                <ModernLogo size={80} variant="icon" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Minimal</h3>
              <div className="flex items-center justify-center space-x-8">
                <ModernLogo size={48} variant="minimal" />
                <ModernLogo size={64} variant="minimal" />
                <ModernLogo size={80} variant="minimal" />
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Logo Variants */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Minimalist Logo</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Full Variant</h3>
              <div className="flex items-center justify-center space-x-8">
                <MinimalistLogo size={48} variant="full" />
                <MinimalistLogo size={64} variant="full" />
                <MinimalistLogo size={80} variant="full" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Icon Only</h3>
              <div className="flex items-center justify-center space-x-8">
                <MinimalistLogo size={48} variant="icon" />
                <MinimalistLogo size={64} variant="icon" />
                <MinimalistLogo size={80} variant="icon" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Text Only</h3>
              <div className="flex items-center justify-center space-x-8">
                <MinimalistLogo size={48} variant="text-only" />
                <MinimalistLogo size={64} variant="text-only" />
                <MinimalistLogo size={80} variant="text-only" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Logo Variants */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Logo</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Full Variant</h3>
              <div className="flex items-center justify-center space-x-8">
                <ProfessionalLogo size={48} variant="full" />
                <ProfessionalLogo size={64} variant="full" />
                <ProfessionalLogo size={80} variant="full" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Icon Only</h3>
              <div className="flex items-center justify-center space-x-8">
                <ProfessionalLogo size={48} variant="icon" />
                <ProfessionalLogo size={64} variant="icon" />
                <ProfessionalLogo size={80} variant="icon" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Compact</h3>
              <div className="flex items-center justify-center space-x-8">
                <ProfessionalLogo size={48} variant="compact" />
                <ProfessionalLogo size={64} variant="compact" />
                <ProfessionalLogo size={80} variant="compact" />
              </div>
            </div>
          </div>
        </div>

        {/* Dark Background Test */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Dark Background Test</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-white">
              <ModernLogo size={64} variant="full" className="text-white" />
            </div>
            <div className="text-white">
              <MinimalistLogo size={64} variant="full" className="text-white" />
            </div>
            <div className="text-white">
              <ProfessionalLogo size={64} variant="full" className="text-white" />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Header Navigation</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ModernLogo size={40} variant="full" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Mobile Header</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <MinimalistLogo size={32} variant="minimal" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Footer</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ProfessionalLogo size={36} variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
