import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-600">ResumeAI</div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Resume, Perfected for Any Role, Any Region
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered resume builder with Gemini AI. Built by Ali.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Regional Compliance</h3>
            <p className="text-gray-600">Formats for US, UK, EU, MENA, Asia</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Industry-Tuned</h3>
            <p className="text-gray-600">Tech, Finance, Healthcare, Creative</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
            <p className="text-gray-600">Gemini AI with STAR method</p>
          </div>
        </div>
      </main>
    </div>
  );
}
