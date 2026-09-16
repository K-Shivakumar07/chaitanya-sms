import { supabase } from '@/integrations/supabase/client';

export const COURSE_FILES_BUCKET = 'course-files';

export const isExternalUrl = (value?: string | null) => !!value && /^https?:\/\//i.test(value);

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const extensionLabel = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toUpperCase() ?? 'PDF';
  if (['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'ZIP'].includes(ext)) {
    return ext.replace('PPTX', 'PPT').replace('DOCX', 'DOC');
  }
  return ext;
};

export const uploadCourseFile = async (folder: string, file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(COURSE_FILES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return path;
};

/** Resolves a stored path (or external link) into a usable download URL. */
export const resolveFileUrl = async (fileUrl: string) => {
  if (isExternalUrl(fileUrl)) return fileUrl;
  const { data, error } = await supabase.storage
    .from(COURSE_FILES_BUCKET)
    .createSignedUrl(fileUrl, 60 * 10, { download: true });
  if (error) throw error;
  return data.signedUrl;
};

export const downloadCourseFile = async (fileUrl: string) => {
  const url = await resolveFileUrl(fileUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
};
