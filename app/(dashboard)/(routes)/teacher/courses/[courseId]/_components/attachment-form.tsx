"use client";

import * as z from "zod"
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Attachment, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import toast from "react-hot-toast";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});

const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null); 

    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Updated!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something Went Wrong!");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setIsDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted!");
            router.refresh();
        } catch {
            toast.error("Something Went Wrong!");
        } finally {
            setIsDeletingId(null);
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {
                        isEditing ? (
                            <>
                                Cancel
                            </>
                        ) :
                        (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a File
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                   <>
                        {
                            initialData.attachments.length === 0 ? (
                                <p className="text-sm mt-2 text-slate-500 italic">
                                    No Attachments
                                </p>
                            ) :
                            (
                                <div className="space-y-2">
                                    {initialData.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                        >
                                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <p className="text-xs line-clamp-1">
                                                {attachment.name}
                                            </p>
                                            {
                                                isDeletingId === attachment.id ? (
                                                    <div>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="ml-auto hover:opacity-75 transition"
                                                        onClick={() => onDelete(attachment.id)}
                                                    >
                                                        <X className="h-4 w-4 "/>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                   </>
                ) 
            }   
            {
                isEditing && (
                    <div>
                        <FileUpload 
                            endpoint="courseAttachment"
                            onChange={(url) => {
                                if(url) onSubmit({ url: url })
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Supported File Types: Image, Audio, Video, PDF
                        </div>
                    </div>
                )
            }
        </div> 
    );
}
 
export default AttachmentForm;