import toast from "react-hot-toast";

export function sendSuccessToast(text: string) {
  toast.success(text, {
    style: {
      backgroundColor: "var(--color-background-700)",
      border: "1px solid var(--color-surface-container-high)",
      color: "var(--color-schemas-on-surface)",
    },
  });
}

export function sendErrorToast(text: string) {
  toast.error(text, {
    style: {
      backgroundColor: "var(--color-background-700)",
      border: "1px solid var(--color-surface-container-high)",
      color: "var(--color-schemas-on-surface)",
    },
  });
}
