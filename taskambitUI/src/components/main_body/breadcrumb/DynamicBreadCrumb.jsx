import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DynamicBreadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Do not render the breadcrumb on the home page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <div className="container mx-auto flex items-center justify-center my-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li>
                        <div>
                            <Link to="/" className="text-gray-700 hover:text-gray-900">
                                Home
                            </Link>
                        </div>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        return (
                            <li key={to} className="inline-flex items-center">
                                <svg className="w-4 h-4 text-gray-500 mx-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M10.293 15.293a1 1 0 010 1.414l-7-7a1 1 0 011.414-1.414L10 13.586l5.293-5.293a1 1 0 011.414 1.414l-7 7z" />
                                </svg>
                                <Link
                                    to={to}
                                    className={`text-gray-700 hover:text-gray-900 ${isLast ? 'font-medium text-indigo-600' : ''}`}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};

export default DynamicBreadcrumb;
