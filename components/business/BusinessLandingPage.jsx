"use client";

export default function BusinessLandingPage({ profile }) {
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Business profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {profile.logoUrl && (
            <img
              src={profile.logoUrl}
              alt={profile.businessName}
              className="h-24 w-24 rounded-lg mx-auto mb-6 object-cover"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.businessName}
          </h1>
          {profile.tagline && (
            <p className="text-xl text-gray-600">
              {profile.tagline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.about && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700">{profile.about}</p>
            </section>
          )}

          {profile.contact && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {profile.contact.phone && (
                  <p className="text-gray-700">
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${profile.contact.phone}`} className="text-blue-600 hover:underline">
                      {profile.contact.phone}
                    </a>
                  </p>
                )}
                {profile.contact.email && (
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${profile.contact.email}`} className="text-blue-600 hover:underline">
                      {profile.contact.email}
                    </a>
                  </p>
                )}
                {profile.contact.website && (
                  <p className="text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a
                      href={profile.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {profile.coverImageUrl && (
          <div className="mt-12">
            <img
              src={profile.coverImageUrl}
              alt="Business cover"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
