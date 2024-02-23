import React from 'react';

// Define a type for the props that the TeamMember component will accept
type TeamMemberProps = {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
};

// Define the TeamMember component with props destructuring
const TeamMember: React.FC<TeamMemberProps> = ({ name, role, imageUrl, linkedinUrl }) => {
  return (
    <div className="max-w-xs mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:h-full md:w-48" src={imageUrl} alt={`Profile of ${name}`} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{role}</div>
          <div className="block mt-1 text-lg leading-tight font-medium text-black">{name}</div>
          <p className="mt-2 text-gray-500">Enjoys food, music, and coding.</p>
          <div className="flex mt-4">
            <a href={linkedinUrl} className="text-indigo-500 hover:text-indigo-600">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
