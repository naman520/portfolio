import React from 'react';
import { ProjectData } from './ProjectData';


export default function Project() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
      {ProjectData && ProjectData.map((project) => (
        <div className='bg-white shadow-xl border-b border-gray-200 rounded-lg h-auto flex flex-col justify-center p-4 break-words hover:bg-red-600 hover:text-white' key={project.id}>
          <a href={project.gitHubLink} className='text-blue-500 mb-2'>Link</a>
          <h3 className='text-xl font-semibold mb-2'>{project.title}</h3>
          <p className='text-gray-600 hover:text-yellow-300'>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
