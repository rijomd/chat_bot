

export const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200  mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-sm">
                        © 2025 Chat Bot - All rights reserved.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <button className="text-gray-500 hover:text-gray-700 text-sm">About</button>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Privacy</button>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Terms</button>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Contact</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};