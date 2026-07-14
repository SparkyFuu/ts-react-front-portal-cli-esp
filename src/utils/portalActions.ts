export const downloadTextFile = (
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const openEmail = (email: string, subject: string) => {
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
};

export const openPhone = (phone: string) => {
  window.location.href = `tel:${phone.replace(/\s/g, "")}`;
};

export const openWhatsapp = (phone: string, text: string) => {
  window.open(
    `https://wa.me/34${phone.replace(/\s/g, "")}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
};
