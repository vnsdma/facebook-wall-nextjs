'use client';

import React, { useState, useRef } from 'react';
import { MessageSquare, Camera, X, Loader2 } from 'lucide-react';
import { validateImageFile, uploadPostPhoto } from '../lib/storage';

interface WallComposerProps {
  onPostCreated: (body: string, authorName: string, imageUrl?: string | null) => Promise<boolean>;
  isPosting: boolean;
}

const MAX_CHARS = 280;

export const WallComposer: React.FC<WallComposerProps> = ({
  onPostCreated,
  isPosting,
}) => {
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const charsLeft = MAX_CHARS - body.length;
  const isOverLimit = charsLeft < 0;
  const hasContent = body.trim().length > 0 || selectedFile !== null;
  const canSubmit = hasContent && !isOverLimit && !isPosting && !isUploadingPhoto;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setFileError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const trimmedBody = body.trim();
    const finalAuthor = authorName.trim() || 'Guest';

    let uploadedUrl: string | null = null;

    if (selectedFile) {
      setIsUploadingPhoto(true);
      try {
        const uploadResult = await uploadPostPhoto(selectedFile);
        if (uploadResult.error && !uploadResult.url) {
          setFileError(uploadResult.error);
          setIsUploadingPhoto(false);
          return;
        }
        uploadedUrl = uploadResult.url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setFileError(message);
        setIsUploadingPhoto(false);
        return;
      } finally {
        setIsUploadingPhoto(false);
      }
    }

    const success = await onPostCreated(trimmedBody, finalAuthor, uploadedUrl);
    if (success) {
      setBody('');
      handleRemovePhoto();
    }
  };

  return (
    <div className="bg-white border border-[#d8dfea] shadow-sm mb-4">
      {/* Box Header */}
      <div className="bg-[#eceff5] px-3 py-1.5 border-b border-[#d8dfea] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3b5998]">
          <MessageSquare className="w-3.5 h-3.5 text-[#3b5998]" />
          <span>Write on Mark&apos;s Wall</span>
        </div>
        <span className="text-[10px] text-gray-500">
          Max {MAX_CHARS} characters
        </span>
      </div>

      {/* Composer Form */}
      <form onSubmit={handleSubmit} className="p-3">
        {/* Author Name Input */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <label htmlFor="author-name" className="text-gray-600 font-semibold text-[11px] whitespace-nowrap">
            Your Name:
          </label>
          <input
            id="author-name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Eduardo, Dustin, or Guest"
            maxLength={40}
            className="text-xs px-2 py-1 border border-[#bdc7d8] rounded-none focus:outline-none focus:border-[#3b5998] w-48 bg-[#fdfdfd]"
          />
        </div>

        {/* Message Textarea */}
        <div className="relative mb-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something... or attach a photo below"
            rows={3}
            aria-label="Wall message text"
            className="w-full text-xs p-2 border border-[#bdc7d8] rounded-none focus:outline-none focus:border-[#3b5998] resize-none bg-[#fdfdfd] placeholder:text-gray-400"
          />
        </div>

        {/* Photo Preview Card */}
        {previewUrl && (
          <div className="mb-2.5 p-2 bg-[#f7f8fa] border border-[#d8dfea] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-14 h-14 bg-white border border-[#bdc7d8] p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px]">
                <div className="font-semibold text-[#3b5998] truncate max-w-[200px]">
                  {selectedFile?.name}
                </div>
                <div className="text-[10px] text-gray-500">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''} • Supabase Storage
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-gray-400 hover:text-red-600 p-1 flex items-center gap-1 text-[11px]"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        )}

        {/* File Error Notice */}
        {fileError && (
          <div className="mb-2 p-1.5 bg-red-50 border border-red-200 text-red-700 text-[11px]">
            {fileError}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-[#f0f2f7]">
          <div className="flex items-center gap-3">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              id="photo-upload-input"
            />
            {/* Attach Photo Button (Classic 2008 style) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs text-[#3b5998] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#3b5998]" />
              <span>{selectedFile ? 'Change Photo' : 'Attach Photo'}</span>
            </button>

            <span
              className={`text-[11px] font-mono ${
                isOverLimit ? 'text-red-600 font-bold' : charsLeft <= 20 ? 'text-amber-600 font-semibold' : 'text-gray-500'
              }`}
            >
              {charsLeft} char{charsLeft === 1 ? '' : 's'}
            </span>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="fb-btn-primary flex items-center gap-1.5"
          >
            {isPosting || isUploadingPhoto ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{isUploadingPhoto ? 'Uploading Photo...' : 'Sharing...'}</span>
              </>
            ) : (
              <span>Share</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
