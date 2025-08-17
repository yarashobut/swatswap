import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

// Main homepage 
export default function Home() {
	return (
		<>
			{/* main banner Section */}
			<section className="bg-maroon-900">
				<Navbar /> 
				<div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
					
					{/* Left side*/}
					<div className="mr-auto place-self-center lg:col-span-7">
						<h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">
							Declutter with purpose. Trade with SwatSwap.
						</h1>
						<p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-white">
							Swarthmore students, swap what you don’t need for what you do — sustainably, ethically, and for free.
						</p>
						<Link
							href="/login"
							className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center border rounded-lg focus:ring-4 text-white border-white-700 hover:bg-maroon-700 focus:ring-white"
						>
							Start Swapping
						</Link>

					</div>

					{/* Right side image */}
					<div className="lg:col-span-5 flex justify-center items-center">
						<Image
							src="/logo1.png"
							alt="SwatSwap Phoenix Logo"
							width={5000}
							height={5000}
							className="w-full h-auto max-w-[700px]"
							priority
						/>
					</div>
				</div>
			</section>

			{/* listing categories section */}
			<h2 className="text-4xl font-bold text-center text-black my-4">
				Popular Categories
			</h2>

			{/* grid of category icons! */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
				{/* each icon represents a category */}
				{[
					{ src: "/icons/airpod.png", label: "Tech" },
					{ src: "/icons/books.png", label: "Books" },
					{ src: "/icons/hat.png", label: "Clothing" },
					{ src: "/icons/lamp.png", label: "Furniture" },
					{ src: "/icons/sports.png", label: "Sports" },
					{ src: "/icons/hairbrush.png", label: "Miscellaneous" },
				].map((cat, index) => (
					<div key={index} className="relative p-4 w-full bg-white rounded-lg overflow-hidden hover:shadow flex flex-col justify-center items-center">
						<div className="w-16 h-16 rounded-lg">
							<Image src={cat.src} width={100} height={100} alt={`${cat.label} image`} />
						</div>
						<p className="mt-2 text-gray-800 text-sm font-semibold line-clamp-1">
							{cat.label}
						</p>
					</div>
				))}
			</div>

			{/* How it works blurb */}
			<section className="p-6 bg-maroon-100 text-white">
				<div className="container mx-auto">
					<span className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-gray-900">
						How it works
					</span>
					<h2 className="text-5xl font-bold text-center text-black">
						SwatSwap is easy!
					</h2>

					{/* Steps in the swap process */}
					<div className="grid gap-6 my-16 lg:grid-cols-3">
						{[
							{ step: "1", text: "Join SwatSwap. Click Start Swapping and join the Swarthmore Community!" },
							{ step: "2", text: "Upload items. Click a picture of your item and upload it." },
							{ step: "3", text: "Swap it. Connect with other students and start trading your items!" },
						].map(({ step, text }) => (
							<div key={step} className="flex flex-col p-8 space-y-4 rounded-md bg-maroon-900">
								<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-white text-gray-900">
									{step}
								</div>
								<p className="text-2xl">
									<b>{text.split(".")[0]}.</b> {text.split(".").slice(1).join(".")}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* bottom Banner */}
			<div className="w-full p-4 text-center border shadow sm:p-8 bg-maroon-900 border-maroon-800">
				<h5 className="mb-2 text-3xl font-bold text-white">
					Get Started and Enjoy SwatSwapping Today
				</h5>
				<p className="mb-5 text-base sm:text-lg text-white">
					SwatSwap is campus-first and community-built — stay tuned for mobile access!
				</p>
			</div>

			{/* footer */}
			<footer className="py-6 bg-maroon-900 text-white">
				<div className="container px-6 mx-auto space-y-6 divide-y divide-maroon-400 md:space-y-12 divide-opacity-50">
					{/* Copyright and contact links --add more later */}
					<div className="grid justify-center pt-6 lg:justify-between">
						<div className="flex flex-col self-center text-sm text-center md:block lg:col-start-1 md:space-x-6">
							<span>©2025 All rights reserved</span>
							<Link href="/contact">Contact Us</Link>
						</div>

						{/* contact via email button -- we dont need both but lets keep this if we cant get the other main one to work */}
						<div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
							<Link
								href="mailto:maryam.taha2003@gmail.com"
								title="Email"
								className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
