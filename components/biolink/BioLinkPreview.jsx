// ─────────────────────────────────────────────────────────────────────────────
// BioLinkPreview — iPhone-framed live preview of a bio-link
//
// Renders the avatar, title, bio, and ordered link buttons inside a fake
// device bezel using the bio-link's theme colors / background image.
// Used in: components/biolink/BioLinkEditorShell.jsx (sticky right column).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

function getIconEmoji(iconName) {
  const emojiMap = {
    instagram: '📱',
    twitter: '𝕏',
    facebook: '📘',
    tiktok: '🎵',
    youtube: '▶️',
    linkedin: '💼',
    github: '🐙',
    email: '✉️',
    phone: '📞',
    whatsapp: '💬',
    website: '🌐',
    download: '⬇️',
    link: '🔗',
  };

  return emojiMap[iconName?.toLowerCase()] || '🔗';
}

export default function BioLinkPreview({ biolink }) {
  const primaryColor = biolink.theme?.primaryColor || '#4F46E5';
  const secondaryColor = biolink.theme?.secondaryColor || '#7C3AED';
  const sortedBlocks = [...(biolink.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="h-[600px] bg-gray-100 overflow-hidden flex items-center justify-center p-4">
      {/* iPhone frame */}
      <div className="w-full max-w-xs">
        {/* Device bezel */}
        <div className="bg-black rounded-[2.5rem] p-3 shadow-2xl">
          {/* Screen */}
          <div
            className="bg-white rounded-[2rem] h-[568px] overflow-y-auto flex flex-col"
            style={{
              background: biolink.backgroundUrl
                ? `url(${biolink.backgroundUrl}) center/cover`
                : `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`,
            }}
          >
            {/* Content */}
            <div className="flex flex-col items-center justify-center flex-1 px-4 py-6">
              {/* Avatar */}
              {biolink.avatarUrl && (
                <div className="mb-4">
                  <img
                    src={biolink.avatarUrl}
                    alt={biolink.title}
                    className="w-20 h-20 rounded-full border-3 object-cover"
                    style={{ borderColor: primaryColor }}
                  />
                </div>
              )}

              {/* Title */}
              {biolink.title && (
                <h2 className="text-xl font-bold text-center text-gray-900 mb-1 line-clamp-2">
                  {biolink.title}
                </h2>
              )}

              {/* Bio */}
              {biolink.bio && (
                <p className="text-center text-gray-600 mb-6 text-xs leading-relaxed line-clamp-3">
                  {biolink.bio}
                </p>
              )}

              {/* Blocks */}
              <div className="w-full space-y-2">
                {sortedBlocks.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-4">
                    Add links to see them here
                  </p>
                ) : (
                  sortedBlocks.map((block) => (
                    <button
                      key={block.id}
                      className="w-full py-2 px-3 rounded-lg font-semibold text-white text-xs transition-transform hover:scale-105 flex items-center justify-center gap-1"
                      style={{
                        background: block.color
                          ? block.color
                          : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {block.icon && <span>{getIconEmoji(block.icon)}</span>}
                      <span className="truncate">{block.label}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Footer branding */}
              <p className="text-center text-gray-500 text-[10px] mt-6">
                Made with ♥ on Webiox
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
