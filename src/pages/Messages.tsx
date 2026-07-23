import { useState, useRef, useEffect, useMemo } from 'react'
import * as Icons from '../components/Icons'
import { useLocalStorage } from '../hooks/useLocalStorage'

/* ─── Types ─── */
export interface Message {
  id: string
  sender: 'me' | 'them'
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  name: string
  online: boolean
  unread: number
  messages: Message[]
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function formatTimeShort(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Now'
  if (mins < 60) return `${mins}m`
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const yest = new Date(now)
  yest.setDate(yest.getDate() - 1)

  if (d.toDateString() === now.toDateString()) return 'Today'
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

/* ─── Dummy Messages ─── */
function makeMsg(sender: 'me' | 'them', text: string, minutesAgo: number): Message {
  return { id: generateId(), sender, text, timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString() }
}

const DEFAULT_CONVOS: Conversation[] = [
  {
    id: 'c1', name: 'Sarah Johnson', online: true, unread: 2,
    messages: [
      makeMsg('them', 'Hey! I just saw your portfolio — it looks amazing!', 120),
      makeMsg('me', 'Thank you so much! That really means a lot 😊', 118),
      makeMsg('them', 'I was wondering if you are available for freelance work?', 115),
      makeMsg('me', 'Absolutely! I have some availability. What did you have in mind?', 112),
      makeMsg('them', "I need a full redesign of my company's landing page.", 110),
      makeMsg('me', "That sounds great! I'd love to discuss the details.", 108),
      makeMsg('them', 'Are you free for a call this week?', 105),
      makeMsg('me', 'Sure! How about Thursday afternoon?', 103),
      makeMsg('them', 'Thursday works perfectly. Let me know what time suits you.', 100),
      makeMsg('me', "I'll send you a calendar invite shortly.", 2),
      makeMsg('them', "Looking forward to it! I'm excited to work with you.", 1),
    ],
  },
  {
    id: 'c2', name: 'Alex Martinez', online: false, unread: 0,
    messages: [
      makeMsg('them', 'Thanks for getting back to me. Let me know your rates.', 360),
      makeMsg('me', "I usually charge $75/hr for consulting work. Here's my rate card.", 355),
      makeMsg('them', "That works for me. Let's move forward with the proposal.", 350),
      makeMsg('me', 'Excellent! I will send over the contract by tomorrow.', 345),
    ],
  },
  {
    id: 'c3', name: 'Emily Chen', online: true, unread: 0,
    messages: [
      makeMsg('them', 'The redesign looks great! Can we schedule a call?', 1440),
      makeMsg('me', "Thank you Emily! I'm glad you like it.", 1435),
      makeMsg('them', 'I have a few minor tweaks Id like to discuss.', 1430),
      makeMsg('me', 'Of course. Im available Monday or Wednesday next week.', 1425),
      makeMsg('them', "Monday works. Let's do 2pm!", 1420),
      makeMsg('me', "Perfect. I'll prepare the updated mockups.", 1415),
    ],
  },
  {
    id: 'c4', name: 'Tech Corp Recruiter', online: false, unread: 1,
    messages: [
      makeMsg('them', "We have an exciting opportunity for a senior developer role at Tech Corp.", 2880),
      makeMsg('me', "Thanks for reaching out! I'd love to learn more about the role.", 2875),
      makeMsg('them', "It's a full-stack position working with React and Node.js.", 2870),
      makeMsg('me', 'That sounds right up my alley. Could you share the job description?', 2865),
      makeMsg('them', 'Absolutely! Ill send it over right away.', 2860),
    ],
  },
]

/* ─── Auto-response helper ─── */
const autoReplies = [
  "That's great to hear! 😊",
  "I appreciate you sharing that with me.",
  "Let me think about it and get back to you.",
  "Sounds good! Let me know if you need anything else.",
  "Thanks for the update! I'll keep it in mind.",
  "Absolutely, I agree with you on that.",
  "Haha, that's awesome! 😄",
  "Sure thing! I'll take care of it.",
  "Perfect, thanks for letting me know.",
  "I understand completely. No worries!",
]

function getRandomReply() {
  return autoReplies[Math.floor(Math.random() * autoReplies.length)]
}

export default function Messages() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('portfolio_conversations', DEFAULT_CONVOS)
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConvo = useMemo(
    () => conversations.find((c) => c.id === activeConvoId) || null,
    [conversations, activeConvoId],
  )

  // Mark as read when opening
  useEffect(() => {
    if (!activeConvoId) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvoId ? { ...c, unread: 0 } : c)),
    )
  }, [activeConvoId, setConversations])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvo?.messages.length])

  const handleSend = () => {
    const text = inputText.trim()
    if (!text || !activeConvoId) return

    const myMsg: Message = { id: generateId(), sender: 'me', text, timestamp: new Date().toISOString() }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? { ...c, messages: [...c.messages, myMsg], unread: 0 }
          : c,
      ),
    )
    setInputText('')

    // Auto-reply after a short delay
    setTimeout(() => {
      const reply: Message = { id: generateId(), sender: 'them', text: getRandomReply(), timestamp: new Date().toISOString() }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvoId
            ? { ...c, messages: [...c.messages, reply] }
            : c,
        ),
      )
    }, 1000 + Math.random() * 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Sort conversations by most recent message
  const sortedConvos = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.timestamp || ''
        const bLast = b.messages[b.messages.length - 1]?.timestamp || ''
        return bLast.localeCompare(aLast)
      }),
    [conversations],
  )

  return (
    <div className="animate-slide-up h-full">
      <div className="flex h-full gap-3 lg:grid lg:grid-cols-[380px_1fr]">
        {/* ─── Conversation List ─── */}
        <div className="hidden sm:flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="shrink-0 border-b border-[var(--border)] px-4 py-3.5">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Messages</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{conversations.length} conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 p-2">
            {sortedConvos.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1]
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvoId(conv.id)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    activeConvoId === conv.id
                      ? 'bg-primary-500/10'
                      : 'hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-sm font-bold text-white">
                      {conv.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-surface)] bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {conv.name}
                        {conv.online && <span className="ml-1.5 text-[10px] text-emerald-400 font-normal">●</span>}
                      </span>
                      {lastMsg && (
                        <span className="text-[11px] text-[var(--text-muted)] shrink-0 ml-2">
                          {formatTimeShort(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">
                        {lastMsg.sender === 'me' && <span className="text-[var(--text-muted)]">You: </span>}
                        {lastMsg.text}
                      </p>
                    )}
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-bold text-white">
                      {conv.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── Mobile conversation selector ─── */}
        <div className="sm:hidden">
          {!activeConvoId && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
              <div className="border-b border-[var(--border)] px-4 py-3.5">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Messages</h2>
              </div>
              <div className="space-y-0.5 p-2">
                {sortedConvos.map((conv) => {
                  const lastMsg = conv.messages[conv.messages.length - 1]
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvoId(conv.id)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                    >
                      <div className="relative shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-sm font-bold text-white">
                          {conv.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        {conv.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-surface)] bg-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{conv.name}</span>
                          {lastMsg && <span className="text-[11px] text-[var(--text-muted)]">{formatTimeShort(lastMsg.timestamp)}</span>}
                        </div>
                        {lastMsg && (
                          <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">
                            {lastMsg.sender === 'me' && <span className="text-[var(--text-muted)]">You: </span>}
                            {lastMsg.text}
                          </p>
                        )}
                      </div>
                      {conv.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-bold text-white">{conv.unread}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Chat View ─── */}
        {activeConvo ? (
          <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 shrink-0">
              {/* Back button (mobile) */}
              <button
                onClick={() => setActiveConvoId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] sm:hidden"
              >
                <Icons.ChevronLeftIcon className="h-4 w-4" />
              </button>
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-sm font-bold text-white">
                  {activeConvo.name.split(' ').map((n) => n[0]).join('')}
                </div>
                {activeConvo.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-surface)] bg-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{activeConvo.name}</p>
                <p className="text-xs text-emerald-400">
                  {activeConvo.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {(() => {
                let lastDate = ''
                return activeConvo.messages.map((msg, i) => {
                  const msgDate = formatDateSeparator(msg.timestamp)
                  const showDate = msgDate !== lastDate
                  lastDate = msgDate
                  const isMe = msg.sender === 'me'
                  const prevMsg = i > 0 ? activeConvo.messages[i - 1] : null
                  const sameGroup = prevMsg && prevMsg.sender === msg.sender
                  const showAvatar = !sameGroup || showDate

                  return (
                    <div key={msg.id}>
                      {/* Date separator */}
                      {showDate && (
                        <div className="flex items-center gap-3 py-3">
                          <div className="flex-1 h-px bg-[var(--border)]" />
                          <span className="text-[11px] font-medium text-[var(--text-muted)] shrink-0">
                            {msgDate}
                          </span>
                          <div className="flex-1 h-px bg-[var(--border)]" />
                        </div>
                      )}

                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-2' : 'mt-0.5'}`}>
                        <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar column */}
                          <div className={`shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                              isMe ? 'bg-primary-500' : 'bg-[var(--text-muted)]'
                            }`}>
                              {isMe ? 'Y' : activeConvo.name[0]}
                            </div>
                          </div>

                          {/* Bubble */}
                          <div
                            className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed max-w-full break-words ${
                              isMe
                                ? 'bg-primary-500 text-white rounded-br-md'
                                : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] rounded-bl-md'
                            }`}
                          >
                            {msg.text}
                            <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-[var(--text-muted)]'}`}>
                              {formatTimeShort(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[var(--border)] p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white transition-all hover:bg-primary-600 active:scale-[0.95] disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Icons.SendIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Empty State ─── */
          <div className="hidden sm:flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-surface-hover)]">
              <Icons.MessagesIcon className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--text-secondary)]">No conversation selected</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Choose a conversation from the left to start chatting</p>
          </div>
        )}

        {/* Mobile: empty conversation list */}
        {!activeConvoId && (
          <div className="hidden sm:hidden" />
        )}
      </div>
    </div>
  )
}
