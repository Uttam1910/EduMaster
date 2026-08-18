import React from 'react';

const CardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col space-y-4">
          <div className="w-full h-48 bg-slate-200 rounded-xl" />
          <div className="space-y-2 pt-2">
            <div className="w-1/3 h-4 bg-slate-200 rounded-md" />
            <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
            <div className="w-full h-4 bg-slate-200 rounded-md" />
            <div className="w-2/3 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="w-1/4 h-5 bg-slate-200 rounded-md" />
            <div className="w-1/3 h-9 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
