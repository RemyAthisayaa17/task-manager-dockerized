type ToastType = "success" | "error";

let toastContainer: HTMLDivElement | null = null;

const getContainer = (): HTMLDivElement => {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (message: string, type: ToastType) => {
  const container = getContainer();
  const toast = document.createElement("div");

  const isSuccess = type === "success";

  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    color: white;
    background: ${isSuccess ? "#16a34a" : "#dc2626"};
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    pointer-events: all;
    min-width: 240px;
    max-width: 360px;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    border-left: 4px solid ${isSuccess ? "#15803d" : "#b91c1c"};
  `;

  const icon = document.createElement("span");
  icon.style.cssText = "font-size:15px;flex-shrink:0;";
  icon.textContent = isSuccess ? "✓" : "✕";

  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });
  });

  const dismiss = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 280);
  };

  
  const AUTO_DISMISS_MS = 3000;

  const timer = setTimeout(dismiss, AUTO_DISMISS_MS);

  // Clicking toast dismisses it early
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    dismiss();
  });
};