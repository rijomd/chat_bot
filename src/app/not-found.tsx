import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
            <Image
                src="/404.jpg" 
                alt="Not Found"
                width={400}
                height={300}
                priority
            />

            <Link
                href="/"
                className="mt-6  text-blue-500 px-6 py-3"
            >
                Go Back Home
            </Link>
        </main>
    );
}
