import React from 'react';

const Button = ({children, type, variants, onClick, onSubmit, styleType}) => {
    return (
        <button type={type}
                onClick={onClick}
                onSubmit={onSubmit}
                className={`${variants ? variants : ''} ${styleType === 'outline' ? 'text-purple-700 border border-purple-700 hover:text-white hover:bg-purple-800 dark:hover:text-white dark:hover:bg-purple-700' : 'text-white bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700'}   focus:outline-none focus:ring-4  font-medium text-sm px-5 py-2.5 text-center mb-2  dark:focus:ring-purple-900 transition-all`}>
            {children}
        </button>
    );
};

export default Button;