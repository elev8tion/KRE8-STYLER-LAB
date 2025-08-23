'use client';

import React from "react";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-cyan-100 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black",
      outline: "border border-cyan-500/30 bg-transparent hover:bg-cyan-500/10",
      ghost: "bg-transparent hover:bg-gray-800/50",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-8 w-8 rounded-full aspect-[1/1]",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// VoiceRecorder Component
interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  visualizerBars = 32,
}) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onStopRecording(time);
      setTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, time, onStartRecording, onStopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full transition-all duration-300 py-3",
        isRecording ? "opacity-100" : "opacity-0 h-0"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-cyan-400">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-cyan-400/50 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/70 to-transparent rounded-full" />
  </div>
);

// Main PromptInputBox Component
interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>((props, ref) => {
  const { 
    onSend = () => {}, 
    isLoading = false, 
    placeholder = "Ask AI to enhance your components...", 
    className,
    value: controlledValue,
    onValueChange
  } = props;
  
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
  const [isRecording, setIsRecording] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showThink, setShowThink] = React.useState(false);
  const [showCanvas, setShowCanvas] = React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const actualValue = controlledValue !== undefined ? controlledValue : input;
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInput(newValue);
    }
  };

  const handleToggleChange = (value: string) => {
    if (value === "search") {
      setShowSearch((prev) => !prev);
      setShowThink(false);
      setShowCanvas(false);
    } else if (value === "think") {
      setShowThink((prev) => !prev);
      setShowSearch(false);
      setShowCanvas(false);
    }
  };

  const handleCanvasToggle = () => {
    setShowCanvas((prev) => !prev);
    setShowSearch(false);
    setShowThink(false);
  };

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const processFile = (file: File) => {
    if (!isImageFile(file)) {
      console.log("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large (max 10MB)");
      return;
    }
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({});
    setFiles([]);
  };

  const handleSubmit = () => {
    if (actualValue.trim() || files.length > 0) {
      let messagePrefix = "";
      if (showSearch) messagePrefix = "[Search: ";
      else if (showThink) messagePrefix = "[Think: ";
      else if (showCanvas) messagePrefix = "[Canvas: ";
      const formattedInput = messagePrefix ? `${messagePrefix}${actualValue}]` : actualValue;
      onSend(formattedInput, files);
      handleValueChange("");
      setFiles([]);
      setFilePreviews({});
    }
  };

  const handleStartRecording = () => console.log("Started recording");

  const handleStopRecording = (duration: number) => {
    console.log(`Stopped recording after ${duration} seconds`);
    setIsRecording(false);
    onSend(`[Voice message - ${duration} seconds]`, []);
  };

  const hasContent = actualValue.trim() !== "" || files.length > 0;

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [actualValue]);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-cyan-500/30 bg-black/60 backdrop-blur-xl p-3 shadow-[0_0_30px_rgba(0,255,204,0.1)] transition-all duration-300",
        isRecording && "border-red-500/70",
        className
      )}
    >
      {files.length > 0 && !isRecording && (
        <div className="flex flex-wrap gap-2 p-2 pb-1 transition-all duration-300">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith("image/") && filePreviews[file.name] && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/30">
                  <img
                    src={filePreviews[file.name]}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 hover:bg-black/90 transition-all"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={cn("transition-all duration-300", isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100")}>
        <Textarea
          ref={textareaRef}
          value={actualValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={
            showSearch
              ? "Search the web..."
              : showThink
              ? "Think deeply about..."
              : showCanvas
              ? "Create on canvas..."
              : placeholder
          }
          className="text-sm font-['Fira_Code']"
          disabled={isLoading || isRecording}
        />
      </div>

      {isRecording && (
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      )}

      <div className="flex items-center justify-between gap-2 px-1 pt-2">
        <div className={cn("flex items-center gap-1", isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible")}>
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="flex h-8 w-8 text-gray-400 items-center justify-center rounded-full transition-all hover:bg-cyan-500/10 hover:text-cyan-400"
            disabled={isRecording}
            title="Upload image"
          >
            <Paperclip className="h-5 w-5" />
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
                if (e.target) e.target.value = "";
              }}
              accept="image/*"
            />
          </button>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleToggleChange("search")}
              className={cn(
                "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                showSearch
                  ? "bg-cyan-500/15 border-cyan-500 text-cyan-400"
                  : "bg-transparent border-transparent text-gray-400 hover:text-cyan-400"
              )}
            >
              <motion.div
                animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                whileHover={{ rotate: showSearch ? 360 : 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
              >
                <Globe className="w-4 h-4" />
              </motion.div>
              <AnimatePresence>
                {showSearch && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="text-xs overflow-hidden whitespace-nowrap"
                  >
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <CustomDivider />

            <button
              type="button"
              onClick={() => handleToggleChange("think")}
              className={cn(
                "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                showThink
                  ? "bg-purple-500/15 border-purple-500 text-purple-400"
                  : "bg-transparent border-transparent text-gray-400 hover:text-purple-400"
              )}
            >
              <motion.div
                animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                whileHover={{ rotate: showThink ? 360 : 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
              >
                <BrainCog className="w-4 h-4" />
              </motion.div>
              <AnimatePresence>
                {showThink && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="text-xs overflow-hidden whitespace-nowrap"
                  >
                    Think
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <CustomDivider />

            <button
              type="button"
              onClick={handleCanvasToggle}
              className={cn(
                "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                showCanvas
                  ? "bg-orange-500/15 border-orange-500 text-orange-400"
                  : "bg-transparent border-transparent text-gray-400 hover:text-orange-400"
              )}
            >
              <motion.div
                animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                whileHover={{ rotate: showCanvas ? 360 : 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
              >
                <FolderCode className="w-4 h-4" />
              </motion.div>
              <AnimatePresence>
                {showCanvas && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="text-xs overflow-hidden whitespace-nowrap"
                  >
                    Canvas
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <Button
          variant={hasContent ? "default" : "ghost"}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-all duration-200",
            isRecording
              ? "bg-transparent hover:bg-red-500/20 text-red-500"
              : hasContent
              ? "shadow-[0_0_20px_rgba(0,255,204,0.3)]"
              : "text-gray-400 hover:text-cyan-400"
          )}
          onClick={() => {
            if (isRecording) setIsRecording(false);
            else if (hasContent) handleSubmit();
            else setIsRecording(true);
          }}
          disabled={isLoading && !hasContent}
          title={
            isLoading
              ? "Stop generation"
              : isRecording
              ? "Stop recording"
              : hasContent
              ? "Send message"
              : "Voice message"
          }
        >
          {isLoading ? (
            <Square className="h-4 w-4 animate-pulse" />
          ) : isRecording ? (
            <StopCircle className="h-5 w-5" />
          ) : hasContent ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
});

PromptInputBox.displayName = "PromptInputBox";