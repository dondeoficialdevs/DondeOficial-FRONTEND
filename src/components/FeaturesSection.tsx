'use client';

export default function FeaturesSection() {
  const features = [
    {
      title: "Find What You Want",
      description: "Rhoncus dolor quam etiam mattis, tincidunt nec lobortis sociis facilisi aenean netus tempor duis.",
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Easy Choose Your Place",
      description: "Rhoncus dolor quam etiam mattis, tincidunt nec lobortis sociis facilisi aenean netus tempor duis.",
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Live Online Assistance",
      description: "Rhoncus dolor quam etiam mattis, tincidunt nec lobortis sociis facilisi aenean netus tempor duis.",
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Speciality</h2>
          <h3 className="text-2xl text-gray-600 mb-6">Comprehensive All Great Destination Here</h3>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Risus urnas Iaculis per amet vestibulum luctus.tincidunt ultricies aenean quam eros eleifend sodales cubilia mattis quam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6 mx-auto">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h4>
              <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
