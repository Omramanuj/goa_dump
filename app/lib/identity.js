function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

export function loadAllowedContacts(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((contact) => contact?.name && contact?.phone)
      .map((contact) => ({
        name: String(contact.name),
        phone: normalizePhone(contact.phone)
      }));
  } catch {
    return [];
  }
}

export function getIdentity() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("squad_identity");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setIdentity(identity) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    "squad_identity",
    JSON.stringify({
      ...identity,
      phone: normalizePhone(identity.phone)
    })
  );
}
