import React from 'react';
import { HiOutlineFolderOpen } from 'react-icons/hi';
import Button from './Button';

const EmptyState = ({
  icon: Icon = HiOutlineFolderOpen,
  title = 'No items found',
  description = 'We couldn\'t find any matching records at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 text-3xl shadow-inner">
        <Icon />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 max-w-md text-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
