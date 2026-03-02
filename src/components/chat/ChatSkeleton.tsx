export default function ChatSkeleton() {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <div className="hidden md:flex w-72 flex-col border-r border-gray-200 p-4 space-y-6">
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />

                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
                            <div className="h-2 w-1/2 bg-gray-100 animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-1 flex-col">
                <div className="h-16 border-b border-gray-200 flex items-center px-6 space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                </div>

                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    <div className="flex items-end space-x-2 max-w-[70%]">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-2xl rounded-bl-none" />
                            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-2xl rounded-bl-none" />
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-auto max-w-[70%]">
                        <div className="h-16 w-64 bg-blue-100 animate-pulse rounded-2xl rounded-br-none" />
                        <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                    </div>

                    <div className="flex items-end space-x-2 max-w-[70%]">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-20 w-56 bg-gray-200 animate-pulse rounded-2xl rounded-bl-none" />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100 animate-pulse" />
                        <div className="h-12 w-full bg-gray-100 animate-pulse rounded-full" />
                        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-200 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}