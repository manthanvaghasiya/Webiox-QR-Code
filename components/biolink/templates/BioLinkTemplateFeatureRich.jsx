"use client";

import { useRouter } from 'next/navigation';

export default function BioLinkTemplateFeatureRich({ biolink }) {
  const router = useRouter();
  const primaryColor = biolink.theme?.primaryColor || '#4F46E5';
  const secondaryColor = biolink.theme?.secondaryColor || '#7C3AED';

  const handleBlockClick = async (block) => {
    if (!block.url) return;

    // Track click
    try {
      await fetch(`/api/biolinks/${biolink._id}/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: block.id }),
      }).catch(() => {});
    } catch (err) {
      console.error('Failed to track click:', err);
    }

    // Open URL
    window.open(block.url, '_blank');
  };

  // Sort blocks by order
  const sortedBlocks = [...(biolink.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: biolink.backgroundUrl
          ? `url(${biolink.backgroundUrl}) center/cover`
          : `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`,
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Avatar */}
          {biolink.avatarUrl && (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={biolink.avatarUrl}
                  alt={biolink.title}
                  className="w-32 h-32 rounded-full border-4 shadow-lg object-cover"
                  style={{ borderColor: primaryColor }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          {biolink.title && (
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
              {biolink.title}
            </h1>
          )}

          {/* Bio */}
          {biolink.bio && (
            <p className="text-center text-gray-600 mb-8 text-sm leading-relaxed">
              {biolink.bio}
            </p>
          )}

          {/* Blocks */}
          <div className="space-y-3 mb-8">
            {sortedBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => handleBlockClick(block)}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md text-white flex items-center justify-center gap-2"
                style={{
                  background: block.color
                    ? block.color
                    : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                {block.icon && <span className="text-xl">{getIconEmoji(block.icon)}</span>}
                <span>{block.label}</span>
              </button>
            ))}
          </div>

          {/* Footer branding */}
          <div className="text-center text-xs text-gray-500 mt-12">
            <p>Made with <span className="text-red-500">♥</span> on Webiox</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple emoji mapping for icons (can be expanded with lucide-react icons)
function getIconEmoji(iconName) {
  const emojiMap = {
    instagram: '📱',
    twitter: '𝕏',
    facebook: 'f',
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
    mail: '📧',
  };

  return emojiMap[iconName?.toLowerCase()] || '🔗';
}
