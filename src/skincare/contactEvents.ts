export const SKINCARE_OPEN_CONTACT = "skincare:open-contact";
export const SKINCARE_CONTACT_LOCK = "skincare:contact-lock";

export type SkincareContactDetail = {
  subject?: string;
};

export type SkincareContactLockDetail = {
  locked: boolean;
};

export function openSkincareContact(detail?: SkincareContactDetail) {
  window.dispatchEvent(
    new CustomEvent<SkincareContactDetail>(SKINCARE_OPEN_CONTACT, { detail }),
  );
}

export function setSkincareContactLock(locked: boolean) {
  window.dispatchEvent(
    new CustomEvent<SkincareContactLockDetail>(SKINCARE_CONTACT_LOCK, {
      detail: { locked },
    }),
  );
}
