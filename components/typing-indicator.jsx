export default function TypingIndicator() {
    return (
      <div className="flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "600ms" }} />
      </div>
    )
  }
  