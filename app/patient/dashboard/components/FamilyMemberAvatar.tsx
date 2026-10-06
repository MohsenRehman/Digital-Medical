"use client";

import React, { useState, useEffect, useMemo } from "react";

interface FamilyMemberAvatarProps {
  memberId: string;
  name: string;
  className?: string;
}

export default function FamilyMemberAvatar({
  memberId,
  name,
  className = "w-11 h-11 rounded-xl text-sm",
}: FamilyMemberAvatarProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const readImage = () => {
      try {
        const saved = localStorage.getItem(`family_member_profile_image_${memberId}`);
        setProfileImage(saved);
      } catch {
        // ignore
      }
    };

    readImage();

    const handleCustomUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ memberId?: string }>;
      if (!custom.detail || custom.detail.memberId === memberId) {
        readImage();
      }
    };

    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === `family_member_profile_image_${memberId}`) {
        readImage();
      }
    };

    window.addEventListener("family-member-profile-image-updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("family-member-profile-image-updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [memberId]);

  const initials = useMemo(() => {
    const trimmed = name.trim();
    if (!trimmed) return "F";
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }, [name]);

  return (
    <div
      className={`bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60 overflow-hidden relative select-none shrink-0 ${className}`}
    >
      {profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profileImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
