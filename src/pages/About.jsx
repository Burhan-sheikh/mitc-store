// FILE PURPOSE:
// - About page with company information

const About = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About MITC</h1>
        <div className="card">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            MITC is your trusted source for commercial-import and business-class laptops. We specialize in providing high-quality laptops for businesses of all sizes.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            With years of experience in the industry, we understand the unique needs of commercial buyers and offer personalized solutions to meet your requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;