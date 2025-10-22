import type { ServerTemplate } from './types.ts';

// NOTE: The iconUrl fields contain pre-generated Base64 strings for each template icon.
export const galleryTemplates: ServerTemplate[] = [
  {
    serverName: "PixelCraft Realms",
    vanityUrlSuggestion: "pixelcraft",
    tagline: "The ultimate hub for Minecraft builders, adventurers, and redstone engineers.",
    serverIconPrompt: "A vibrant, pixelated Minecraft grass block with a sword sticking out of it, set against a blocky landscape.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAEGBwQFAgP/xAAwEAABAwMDAgQEBgMAAAAAAAABAgMEAAURBhIhMQcTFCJBUWFxgZEyobHB0UKh8P/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACERAQACAgICAgMAAAAAAAAAAAABEQISITEDQVETYSJx/9oADAMBAAIRAxEAPwDqUqg4gZ3/AFoFe9QWSx3eFa7hKLUqVt4QELVjccDPpmu247k/g/Woy/wCg7De7vHuchp1mUysOExnC2FlJyMgdaKrbW2rWq6y7PbL9BkT4hUHmEFQLZScHcYOD6ZqeoK/Z9MWiyS3pcGO4y++oqccMlxZUTznKjWwKKpSlKBSlKBSlKBSlKBSlKBXzOPen1oFaWurF0k6j1XcbS0qPbmVKaC3ElCX8K2qGe+Mjgd8mndUJrHTtyuF4nOW203CG5LcHjPImN9i4M43bFKB+eDSr3G0+U3+5Qrbc0wYdhaMh5qS0tCXn9oKUjO0kDJ54zWzpLVF0vl/YiyXUNx3rQ3M6aQMKacK8YP5U8u+jdQS7tqeYl9DLtyiIiNLStJDYSnbngZX/AFjI4FStI6XnWa/wALv6kYVb0QkBsYKVBWdp47bRSK2KUpQKUpQKUpQKUpQKUpQKUpQKUpQKVH3y/2uxNJXcpbbBWdqEnlSj6AdzUd98dBf0qP/8AUv8AOKytY4y8XWlUX746C/pUf/6l/wCcU++Ogv6VH/8AUv/nFZ9n4t4utKov3x0C/pUf/wDale/8AOKfbHQU/So//ANa/84p2fi3i60qi/fHQX9Kj/wD1L/zin3x0F/So/wD/AFL/AM4p2fi3i60qi/fHQX9Kj/8A1L/zioDV+qrLOsUyPCurT769u1CN244IPHFTHWOPhLeLrXhtSlJWoAlIySewe1ejUir/wC4y/yVf9orKtD/ABHUarn4bWr/AF3H0tY597lIU63FGQgHBWokJSM8DJIHPFM7Tmqb/dL/AGODcG7W23dIDk3bGU6VMhGFJBVjBJBGeBg+tTWrLKNSaZuNkU+Y4mMloOgZ2HJBB9sgVKaZ0t9g3bT9z8X1u/bLeq37OnjYdwIUvOTkYxjGOfWi/F52W/S6UpQKUpQKUpQKUpQKUpQKkVe/cZP5Kv+01F1Jq/wC4yfyVf9prm6f5GdpdfpyPXeo mXENOraWtvJQojKk564PcVof8AWto0/qGz2K4NylzLqSlpUdCVISQoJxuKgckjsDXrS97OotJ2a9pb6QnxUSEn0yOR+DkVGutNK3DUGstJXmHKitx7G+t59p5Ktzm5SSAnAwOUDkkdqj6fJsvSlKBSlKBSlKBSlKBSlKBVG3JX2LHe5L7+k3jfsQpavXBwMAEk8jtSpVApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlB//2Q==',
    roles: [
      { name: "Owner", permissions: ["Administrator"], color: "#E91E63", hoist: true },
      { name: "Admin", permissions: ["Manage Server", "Kick/Ban Members"], color: "#F44336", hoist: true },
      { name: "Moderator", permissions: ["Manage Messages", "Mute Members"], color: "#2196F3", hoist: true },
      { name: "Builder", permissions: ["Share Projects", "Use External Emojis"], color: "#4CAF50", hoist: true },
      { name: "Member", permissions: ["Read Messages", "Send Messages"], color: "#9E9E9E", hoist: false },
    ],
    categories: [
      {
        name: "🏰 Welcome",
        channels: [
          { name: "👋 ・ welcome", type: "text", topic: "Welcome new members!" },
          { name: "📜 ・ server-rules", type: "text", topic: "Read the server rules here." },
          { name: "📢 ・ announcements", type: "text", topic: "Important server announcements." },
        ]
      },
      {
        name: "💬 General",
        channels: [
          { name: "💬 ・ general-chat", type: "text", topic: "Talk about anything Minecraft related." },
          { name: "🧱 ・ show-your-builds", type: "text", topic: "Share your latest creations." },
          { name: "🤖 ・ bot-commands", type: "text", topic: "Use bot commands here." },
        ]
      },
      {
        name: "🎮 Gameplay",
        channels: [
          { name: "🤝 ・ looking-for-group", type: "text", topic: "Find others to play with." },
          { name: "🔊 ・ Survival VC", type: "voice", topic: "Voice chat for survival players." },
          { name: "🔊 ・ Creative VC", type: "voice", topic: "Voice chat for creative builders." },
        ]
      }
    ],
    serverSettings: {
      verificationLevel: "Low",
      explicitContentFilter: "All Members",
      defaultNotifications: "Mentions Only"
    }
  },
  {
    serverName: "Producer's Booth",
    vanityUrlSuggestion: "producers",
    tagline: "A community for music producers to collaborate, get feedback, and share secrets.",
    serverIconPrompt: "A sleek, minimalist vector logo of a music equalizer wave forming a circle, with a vinyl record in the center. Neon colors on a dark background.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAwQHAgH/xAAwEAABBAEDAgMGBwAAAAAAAAABAgMEEQUAEiExQRNRYQYUIjJxgaGxwdHwFCRSkv/EABcBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAgEQEBAAIBBAIDAAAAAAAAAAABAhEDITEEEkFRYSIT/9oADAMBAAIRAxEAPwC9RRRQFFFFAUUUUBRRRQFFFFAz3UGoIOndLz9Q3BDr0ODt3oZAK1buSgYJIA5Unv2qQqk+MOkrnqvw3vFhtMllmVLDAS4+VEYQ+2tQ2gEklKVAcDnGR3q1Bf4Wavc114b2bVL8JMRyep8FhtW4JCHnGwQe4OzmrfSq94S6Ik+H3hu0acmTY8x2O/IcHktFI2rcUoJO4k7gFYVxxwAOVGrApQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAj3zU1itBQi73eFCU4dqA+8lBUfQCetQ/wD3C0T98bb/AJ6f1V71bpLSd8fRcL7ZIUuSgAB55sFZA7Anvj2NVz91/hh+xbf+yP6oR4Zqf7haJ++Nt/z0/qo/uFon7423/PT+qof7r+GH7Ft/7I/qj91/DD9i2/9kftXlT4z1P8AcLRP3xtv+en9VH9wtE/fGbb/np+qof7r+GH7Ft/8AyR/VH7r+GH7Ft/7I/ajKnzPqf7haJ++Nt/z0/qo/uFon7423/PT+qof7r+GH7Ft/7I/qj91/DD9i2/8AZH7UZU+Z9T/cLRP3xtv+en9VQ9/13pKZp25xY+oYDjz0V5tptLwJWooggAeSSavH7r+GH7Ft/7I/aoW+eGfh1E05c5DPp+G26zFeWhSWQCFCiCAfIJBNGVPmasiirJpq0ajQhd1hIeCDlJU4tOPyIoq9g/M0UUUEnZ9LWSzvuPWuGphx07lqDy1En6qJFXRVEUUUUBRRRQFFFFAUUUUBRRRQf/9k=',
    roles: [
      { name: "Booth Owner", permissions: ["Administrator"], color: "#FF416C", hoist: true },
      { name: "Sound Engineer", permissions: ["Manage Server", "Kick/Ban Members"], color: "#FF4B2B", hoist: true },
      { name: "DJ", permissions: ["Manage Messages", "Move Members"], color: "#00B4DB", hoist: true },
      { name: "Artist", permissions: ["Share Music", "Stream"], color: "#22c1c3", hoist: true },
      { name: "Listener", permissions: ["Read Messages", "Connect"], color: "#95a5a6", hoist: false },
    ],
    categories: [
      {
        name: "🎧 The Booth",
        channels: [
          { name: "👋 ・ introductions", type: "text", topic: "Introduce yourself and your music style." },
          { name: "📜 ・ rules-and-info", type: "text", topic: "Community guidelines and info." },
          { name: "📰 ・ industry-news", type: "text", topic: "Latest news in the music world." },
        ]
      },
      {
        name: "🎶 Music & Feedback",
        channels: [
          { name: "🎵 ・ work-in-progress", type: "text", topic: "Share your WIPs and get feedback." },
          { name: "🔊 ・ feedback-lounge", type: "voice", topic: "Live feedback sessions." },
          { name: "🎹 ・ production-tips", type: "text", topic: "Share your favorite tips and tricks." },
        ]
      },
      {
        name: "🤝 Collaboration",
        channels: [
          { name: "🎤 ・ find-collabs", type: "text", topic: "Looking for a vocalist, producer, etc.?" },
          { name: "💻 ・ Studio A", type: "voice", topic: "Collaboration voice channel." },
        ]
      }
    ],
    serverSettings: {
      verificationLevel: "Medium",
      explicitContentFilter: "All Members",
      defaultNotifications: "Mentions Only"
    }
  },
  {
    serverName: "Writer's Parchment",
    vanityUrlSuggestion: "parchment",
    tagline: "An elegant guild for writers to workshop ideas, get critiques, and find inspiration.",
    serverIconPrompt: "An elegant logo of a quill pen dripping ink that transforms into a sprawling fantasy world with castles and dragons. Sepia tones.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAAMAAwEAAAAAAAAAAAAAAAMEBQIGAQf/xAAsEAABBAEDAgQGAwEAAAAAAAABAAIDBBEFEiExE0FRBhQiYXGBkaGxwdHh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECAwT/xAAgEQEAAgEEAgMAAAAAAAAAAAAAAQIRAxIhMUETIlFh/9oADAMBAAIRAxEAPwC/REQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQ+A/...',
    roles: [
      { name: "Guild Master", permissions: ["Administrator"], color: "#c27c0e", hoist: true },
      { name: "Editor", permissions: ["Manage Messages", "Kick Members"], color: "#e67e22", hoist: true },
      { name: "Critiquer", permissions: ["Read Messages", "Comment"], color: "#71368a", hoist: true },
      { name: "Novelist", permissions: ["Share Work", "Participate in Events"], color: "#9b59b6", hoist: false },
      { name: "Poet", permissions: ["Share Work", "Participate in Events"], color: "#3498db", hoist: false },
      { name: "Reader", permissions: ["Read Messages", "React"], color: "#95a5a6", hoist: false },
    ],
    categories: [
      {
        name: "📜 The Great Hall",
        channels: [
          { name: "🖋️ ・ introductions", type: "text", topic: "Introduce yourself and your current projects." },
          { name: "📚 ・ library-and-rules", type: "text", topic: "Guild rules and resource directory." },
          { name: "📢 ・ guild-announcements", type: "text", topic: "Official news and events." },
        ]
      },
      {
        name: "✒️ The Scriptorium",
        channels: [
          { name: "✍️ ・ general-discussion", type: "text", topic: "General writing chat." },
          { name: "💡 ・ brainstorming", type: "text", topic: "Share ideas and get inspired." },
          { name: "📝 ・ workshop", type: "text", topic: "Post your work for critique." },
        ]
      },
      {
        name: "🗣️ The Round Table",
        channels: [
          { name: "🎤 ・ Open Mic Night", type: "voice", topic: "Share your work live." },
          { name: "☕ ・ The Lounge", type: "voice", topic: "Casual voice chat." },
        ]
      }
    ],
    serverSettings: {
      verificationLevel: "Low",
      explicitContentFilter: "All Members",
      defaultNotifications: "Mentions Only"
    }
  },
  {
    serverName: "The Canvas Collective",
    vanityUrlSuggestion: "canvas",
    tagline: "A vibrant space for artists to share, learn, and find inspiration.",
    serverIconPrompt: "A minimalist logo of a colorful paintbrush stroke forming a perfect circle, on a dark, textured background. Modern and clean.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAUDBAYBAgf/xAAqEAACAQMDAwQCAgMAAAAAAAAAAQIDBBEFITESQWEGE1FxgRQiMpGhscH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EABwRAQEBAQACAwEAAAAAAAAAAAABEQIhMQMSQf/aAAwDAQACEQMRAD8A6UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAyAAAAAAAAAAAAAAAAAAAAADGTyByDODGQDIAAAAAAAAZAAAZAAAAAAAAAAAAAAAAAABUuN9XoXSpSp0lOnGTc9nFtPjhP5AnQZWjd6N7SlOjUTcXhxa2tP5RqoAAAAAAAAAEHU7nWs721pUKMZ06rsyUot7m3hL3I/AG1u9O4t6e/coSjDOPL+f4NT7u6r3lR07WnFTeG5wSa9vB8x32tG2oqpaV4yqU3+pGSScV/wAs+xCqXNa6uqleUnOb8yfLf+Sceh7+C3bXlC7oKpRlmm8NPhxfk16AAAAAEHUby/tLqlChRjUoyg3NqLbaI8hXo3FvTq0ZqUJrxZ/YNgAAAAAAADgCjeaZSr1XVozdKo/MyWVL3LwA9rSt7WhGnSgoxXgvmZAAAAAAAKF5pNKvVdWjN0qj8zSyp+5eDXAAAAAAAAAAAAAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z',
    roles: [
      { name: "Art Director", permissions: ["Administrator"], color: "#d35400", hoist: true },
      { name: "Curator", permissions: ["Manage Messages", "Kick Members"], color: "#c0392b", hoist: true },
      { name: "Illustrator", permissions: ["Post Art", "Stream"], color: "#2980b9", hoist: false },
      { name: "Designer", permissions: ["Post Art", "Stream"], color: "#8e44ad", hoist: false },
      { name: "Sketch Artist", permissions: ["Read Messages", "React"], color: "#7f8c8d", hoist: false }
    ],
    categories: [
      {
        name: "🎨 Welcome Center",
        channels: [
          { name: "👋 ・ welcome", type: "text", topic: "Welcome to the collective!" },
          { name: "📜 ・ guidelines", type: "text", topic: "Studio rules and guidelines." },
          { name: "✨ ・ get-roles", type: "text", topic: "Pick your art discipline roles." }
        ]
      },
      {
        name: "🖌️ The Studio",
        channels: [
          { name: "💬 ・ art-chat", type: "text", topic: "General discussion about art and design." },
          { name: "🖼️ ・ showcase", type: "text", topic: "Share your finished masterpieces!" },
          { name: "🔍 ・ feedback-requests", type: "text", topic: "Ask for constructive criticism on your work." }
        ]
      },
      {
        name: "🗣️ Crit Corner",
        channels: [
          { name: "🎤 ・ Live Critiques", type: "voice", topic: "Join for live art feedback sessions." },
          { name: "☕ ・ Art Lounge", type: "voice", topic: "Relax and chat with fellow artists." }
        ]
      }
    ],
    serverSettings: { verificationLevel: "Low", explicitContentFilter: "All Members", defaultNotifications: "Mentions Only" }
  },
  {
    serverName: "Sakura Cafe 桜",
    vanityUrlSuggestion: "sakuracafe",
    tagline: "Your cozy corner for all things anime, manga, and Japanese culture.",
    serverIconPrompt: "A cute, chibi-style anime girl with pink hair, holding a cup of tea, with sakura petals floating around her. Soft, pastel colors.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAAICAwEAAAAAAAAAAAAAAAYHAQUCAwT/xAAuEAABBAEDAgMHAwUAAAAAAAABAgMEBREABhIhMRNBURQiYXEHIzKBkaGxwdHh/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAgEQEBAAICAgIDAAAAAAAAAAABAhEDIRIxQVFhE0Jx/9oADAMBAAIRAxEAPwDqVFFFAUUUUBRRRQFFFFAUUUUBTfXr+Tp/AEy+RYbMt2s4H0231FKCrgkA4BPaqv4h6ivGl9D3rUNihxJk2qhpwNS1qSgpK0pV9oIzhJUe/cCrrw81S5rrw8sGp3oaYjt2zqUGErKU4cUjgnv8Adz+dE+GWWKKa6P1D+p+jLVqT8v+X+bQs+jrzvwlakYycDOcfQVYqUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFN/iDrCBoLRE/Vtyjvy4lcpCXGWAN53uobBGSOxUD+madBUX4y6VvGs/C65WKwKaTNcU06guubEFDbqFrTnsCUgpGe5FXXyK8PdVs660Na9UsQ3IiLltPpuqUVbcLUjBI7H3Z/Or/So/h3pmbpbQNksE+Y3LkQGShbraSlBJWpXGeTjOPz7VKUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAUUUUBRRRQf/Z',
    roles: [
      { name: "Kaichou (会長)", permissions: ["Administrator"], color: "#ff69b4", hoist: true },
      { name: "Senpai (先輩)", permissions: ["Manage Messages", "Kick Members"], color: "#8a2be2", hoist: true },
      { name: "Weeb", permissions: ["Use External Emojis", "Change Nickname"], color: "#00bfff", hoist: false },
      { name: "Manga Reader", permissions: ["Read Messages"], color: "#d3d3d3", hoist: false },
      { name: "Anime Watcher", permissions: ["Read Messages"], color: "#d3d3d3", hoist: false }
    ],
    categories: [
      {
        name: "🌸 Welcome to the Cafe",
        channels: [
          { name: "👋 ・ welcome", type: "text", topic: "Welcome, please enjoy your stay!" },
          { name: "📜 ・ info-and-rules", type: "text", topic: "Cafe menu and rules." },
          { name: "🎀 ・ get-roles", type: "text", topic: "Choose your favorite genre roles." }
        ]
      },
      {
        name: "💬 Main Lounge",
        channels: [
          { name: "🍵 ・ general-chat", type: "text", topic: "General chit-chat about anything." },
          { name: "📺 ・ anime-discussion", type: "text", topic: "Discuss the latest episodes." },
          { name: "📚 ・ manga-discussion", type: "text", topic: "Talk about your favorite manga." }
        ]
      },
      {
        name: "🎬 Screening Room",
        channels: [
          { name: "🍿 ・ Movie Night", type: "voice", topic: "Weekly movie nights!" },
          { name: "🎤 ・ Anime VC", type: "voice", topic: "Watch and discuss anime together." }
        ]
      }
    ],
    serverSettings: { verificationLevel: "Medium", explicitContentFilter: "All Members", defaultNotifications: "Mentions Only" }
  },
  {
    serverName: "The Gains Garden",
    vanityUrlSuggestion: "gains",
    tagline: "Grow stronger together. Workouts, nutrition, and mental wellness.",
    serverIconPrompt: "A strong, geometric logo of a kettlebell with a leaf sprouting from the handle. Green and charcoal grey colors.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgMAAQQFBgf/xAAqEAABAwIEBQQDAQAAAAAAAAABAAIDBBEFEiExQWEGEyJRYXGhscHR8P/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAHREBAQEAAgMBAQEAAAAAAAAAAAERAgMSITFBQf/aAAwDAQACEQMRAD8A6goKCgoKCgoKCgoKCgoPhKA9kBygOUBygOUAITQGqAUhCAUhCAUhCAUhCAU1zGvaWvaHNIwQRkFB8YxsbAxgDWtGABoArlBQeY4Y4W7YmNY3WwGAV6goKCgoKCgoPhKA9kBygOUBygOUBzQAhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCAUhCA/9k=',
    roles: [
      { name: "Head Coach", permissions: ["Administrator"], color: "#2ecc71", hoist: true },
      { name: "Trainer", permissions: ["Manage Messages", "Mute Members"], color: "#3498db", hoist: true },
      { name: "Gym Rat", permissions: ["Share Progress", "Encourage Others"], color: "#e67e22", hoist: true },
      { name: "Nutritionist", permissions: ["Share Recipes"], color: "#1abc9c", hoist: false },
      { name: "Member", permissions: ["Read Messages", "Send Messages"], color: "#95a5a6", hoist: false }
    ],
    categories: [
      {
        name: "💪 The Gym Floor",
        channels: [
          { name: "👋 ・ welcome-desk", type: "text", topic: "Sign in and say hello!" },
          { name: "📜 ・ gym-rules", type: "text", topic: "Our community fitness guidelines." },
          { name: "📢 ・ announcements", type: "text", topic: "News, events, and challenges." }
        ]
      },
      {
        name: "🏋️‍♀️ Training Zone",
        channels: [
          { name: "💬 ・ general-fitness", type: "text", topic: "Discuss training, routines, and goals." },
          { name: "📈 ・ workout-logs", type: "text", topic: "Track your workouts and stay accountable." },
          { name: "📸 ・ progress-pics", type: "text", topic: "Share your transformation journey." }
        ]
      },
      {
        name: "🥗 The Kitchen",
        channels: [
          { name: "🍎 ・ nutrition-chat", type: "text", topic: "Talk about diets, macros, and healthy eating." },
          { name: "🍳 ・ meal-prep-ideas", type: "text", topic: "Share your favorite recipes." }
        ]
      }
    ],
    serverSettings: { verificationLevel: "Medium", explicitContentFilter: "Medium", defaultNotifications: "Mentions Only" }
  }
];