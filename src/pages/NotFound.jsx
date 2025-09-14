import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-9xl font-extrabold text-gray-200 select-none">
                        404
                    </h1>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
                    <p className="text-gray-600 text-lg max-w-sm mx-auto leading-relaxed">
                        Sorry, the page you are looking for does not exist.
                    </p>
                </div>

                <div className="pt-4">
                    <svg
                        className="w-12 h-12 text-green-500 mx-auto animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>

                <div className="pt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                        Go Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
