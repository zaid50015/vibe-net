'use client';

import { Member, MemberRole, Profile } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import UserAvatar from '../user-avatar';
import { ActionTollTip } from '../ui/action-tool-tip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import qs from 'query-string';
import axios from 'axios';
import { useModalStore } from '@/hooks/use-modal-store';
import { useRouter, useParams } from 'next/navigation';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdate: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-indigo-500" />,
};

const formSchema = z.object({ content: z.string().min(1) });

const ChatItem: FC<ChatItemProps> = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdate,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModalStore();
  const params = useParams();
  const router = useRouter();

  // 🈯 Translation state
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('hi'); // default to Hindi
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: content,
          source: 'en',
          target: selectedLang,
          format: 'text',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      console.log("Translated_data",data)
      setTranslatedContent(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversation/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isLoading;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, value);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const fileType = fileUrl?.split('.').pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTollTip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTollTip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {/* Text Message */}
          {!fileUrl && !isEditing && (
            <div className="flex flex-col gap-1">
              <p
                className={cn(
                  'text-sm text-zinc-600 dark:text-zinc-300',
                  deleted &&
                    'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                )}
              >
                {translatedContent || content}
                {isUpdate && !deleted && (
                  <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-00">
                    (edited)
                  </span>
                )}
              </p>

              {!deleted && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="text-xs bg-black border rounded px-1 py-0.5 dark:text-white "
                  >
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>

                  {!translatedContent && (
                    <button
                      onClick={handleTranslate}
                      disabled={isTranslating}
                      className="hover:underline text-blue-500"
                    >
                      {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                  )}

                  {translatedContent && (
                    <button
                      onClick={() => setTranslatedContent(null)}
                      className="text-red-400 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Editing Form */}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>

      {/* Action buttons (Edit/Delete) */}
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTollTip label="edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTollTip>
          )}
          <ActionTollTip label="delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTollTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
