export default function Newsletter() {
  return (
    <section className="bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-lg font-semibold">Subscribe on our newsletter</h2>
        <p className="text-gray-500 text-sm mt-1">
          Get daily news on upcoming offers from many suppliers all over the world
        </p>

        {/* Form */}
        <form className="mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none w-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
