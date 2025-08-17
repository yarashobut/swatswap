"use client";
//revist this and try to get it to work bc it would be so cool ohmygosh
import emailjs from 'emailjs-com';
import Image from "next/image";
const Contact = () => {
	const sendEmail = (e) => {
		e.preventDefault();
	  
		emailjs.sendForm(
			'service_die5mnj',     // Replace with actual Service ID
		  'template_rv0c4py',    // Replace with Template ID
		  e.target,              //  refers to form element
		  '7oRLCtfMMtMOYICIu'         // Replace with Public Key
		).then(
		  (result) => {
			alert('Message sent successfully!');
		  },
		  (error) => {
			alert('Failed to send. Try again.');
		  }
		);
	  };	  
	return (
		<>
			<div className="pt-10 text-center">
				<h2 className="text-7xl lg:text-7xl font-bold leading-tight">
					Get in touch
				</h2>
				<p className="text-gray-900 mt-5 text-3xl">
					We are here to help
				</p>
			</div>
			<div className="max-w-7xl mx-auto px-8 grid gap-8 grid-cols-1 md:grid-cols-2 py-16 text-gray-900 rounded-lg ">
				<div className="flex flex-col justify-between">
					<Image
						priority
						className="w-full h-full"
						src="/contact.png"
						alt="Contact us image"
						width={500}
						height={500}
					/>
				</div>
				<form onSubmit={sendEmail}>
					<div>
						<span className="text-sm text-gray-600 font-bold">
							Name
						</span>
						<input
							className="w-full mt-2 px-3 py-2 text-black bg-transparent outline-none border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
							type="text"
							placeholder=""
							name="name"
							required
						/>
					</div>
					<div className="mt-8">
						<span className="text-sm text-gray-600 font-bold">
							Email
						</span>
						<input
							className="w-full mt-2 px-3 py-2 text-black bg-transparent outline-none border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
							type="email"
							name="email"
							required
						/>
					</div>
					<div className="mt-8">
						<span className="text-sm text-gray-600 font-bold">
							Message
						</span>
						<textarea
							required
							name="message"
							className="w-full mt-2 h-36 px-3 py-2 text-black resize-none appearance-none bg-transparent outline-none border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
						></textarea>
					</div>
					<div className="mt-8">
						<button className="w-full px-4 py-2 text-white font-medium bg-maroon-800 hover:bg-maroon-500 active:bg-maroon-600 rounded-lg duration-150">
							Submit
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Contact;

