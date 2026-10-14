import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Send, Sparkles, RefreshCw, ArrowRight, CornerDownLeft, Palette, DollarSign } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AiAssistantDrawerProps {
  onSelectProduct?: (product: Product) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ onSelectProduct }) => {
  const {
    activeProject,
    activeRevision,
    refineWithAiInstruction,
    replaceProductInProject,
    formatPrice,
    totalCost,
    remainingBudget,
    updateActiveProject,
  } = useProject();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I'm your Homie.AI spatial architect. I have analyzed your ${activeProject?.roomType.replace('_', ' ') || 'room'} in the ${activeProject?.style || 'Scandinavian'} aesthetic. How would you like to refine the atmosphere, furniture selections, or budget?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Change the wall color to sage green',
    'Show a Japanese minimalist Japandi version',
    'Replace the sofa with a more compact option',
    'Make the room look more spacious',
    'Keep budget strictly under ₹50,000',
    'Add warm 2700K ambient accent lighting',
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const selectedSummary = activeProject?.selectedProductIds.join(', ') || '';
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          projectContext: {
            roomType: activeProject?.roomType,
            style: activeProject?.style,
            budget: activeProject?.budget,
            spent: totalCost,
            selectedProductsSummary: selectedSummary,
            wallColor: activeRevision?.wallColor,
          },
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);

        // If the assistant recommends an immediate render or style revision
        if (data.shouldTriggerRender) {
          await refineWithAiInstruction(textToSend);
        }
      }
    } catch (err) {
      console.error(err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `I've registered your instruction to "${textToSend}". Let me adjust the design parameters and budget accordingly.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      await refineWithAiInstruction(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyAction = async (action: NonNullable<ChatMessage['suggestedAction']>) => {
    if (action.type === 'color_change' && action.payload?.color) {
      await refineWithAiInstruction(`Change wall color to ${action.payload.color}`);
    } else if (action.type === 'style_shift' && action.payload?.style) {
      await refineWithAiInstruction(`Shift style to ${action.payload.style}`);
    } else if (action.type === 'cheaper_alternatives') {
      const highestItem = activeProject?.selectedProductIds[0];
      if (highestItem) {
        // handled via context
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#DFD9CE] overflow-hidden">
      {/* Header Bar */}
      <div className="p-3.5 bg-[#F2EDE4] border-b border-[#DFD9CE] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8B9B88]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1E1E] font-mono">
            AI Spatial Assistant
          </h3>
        </div>
        <div className="text-[11px] font-mono text-[#57534E]">
          <span>Spent: {formatPrice(totalCost)}</span>
          <span className="mx-1">/</span>
          <span className="font-semibold">{formatPrice(activeProject?.budget || 0)}</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 max-w-[88%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1E1E1E] text-[#FAF8F5]'
                  : 'bg-white border border-[#DFD9CE] text-[#1E1E1E] shadow-xs'
              }`}
            >
              <p>{msg.text}</p>

              {/* Action Button if attached */}
              {msg.suggestedAction && (
                <div className="mt-2.5 pt-2 border-t border-[#EAE6DF]">
                  <button
                    onClick={() => handleApplyAction(msg.suggestedAction!)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-[#8B9B88] text-white hover:bg-[#788876] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{msg.suggestedAction.label || 'Apply to Room'}</span>
                  </button>
                </div>
              )}

              {/* Attached Suggested Products */}
              {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-[#EAE6DF] pt-2">
                  <p className="text-[10px] font-mono uppercase text-[#7A756D]">Recommended Pieces:</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {msg.suggestedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 p-1.5 bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#8B9B88] transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 object-cover shrink-0 bg-[#EAE6DF]"
                          />
                          <div className="truncate">
                            <p className="font-medium text-[11px] truncate">{p.name}</p>
                            <p className="text-[10px] text-[#7A756D] font-mono">{formatPrice(p.price)} · {p.retailer}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(p);
                          }}
                          className="text-[10px] font-mono text-[#1E1E1E] hover:underline shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-[#7A756D] mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#7A756D] font-mono p-2">
            <RefreshCw className="w-3 h-3 animate-spin text-[#8B9B88]" />
            <span>Homie AI is evaluating room parameters...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-2.5 bg-[#F2EDE4]/60 border-t border-[#DFD9CE] overflow-x-auto">
        <p className="text-[10px] font-mono text-[#7A756D] uppercase mb-1.5">Instant Prompts:</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-white hover:bg-[#EAE4D9] border border-[#DFD9CE] text-[#4A4742] transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-[#DFD9CE]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Change wall color to sage green or find cheaper sofa..."
            className="flex-1 text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder:text-[#9C968B]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2 bg-[#1E1E1E] text-white hover:bg-[#333333] disabled:opacity-40 transition-colors shrink-0"
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
