'use client';

import Spinner from '@/app/components/Spinner'
import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DeleteStudentButton = ({ studentId }: { studentId: number }) => {
    const router = useRouter();
    const [error, setError] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const { status, data: session } = useSession();

    const deleteStudent = async () => {
        try {
            setDeleting(true);
            await axios.delete('/api/student/' + studentId);
            toast.success("Student has been deleted successfully.", { duration: 3000, });
            router.push('/school/' + session?.user.schoolId);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!", { duration: 3000, });
            setDeleting(false);
            setError(true);
        }
    };

    return (
        <>
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    {(status === "authenticated" && session && session.user.role === 'ADMIN' || session?.user.role === 'SCHOOL') && <Button color="red" disabled={isDeleting}>
                        Delete Student
                        {isDeleting && <Spinner />}
                    </Button>}
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
                    <AlertDialog.Description>
                        Are you sure you want to delete this student? This action cannot be
                        undone.
                    </AlertDialog.Description>
                    <Flex mt="4" gap="3" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button color="red" onClick={deleteStudent}>
                                Delete Student
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <AlertDialog.Root open={error}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Error</AlertDialog.Title>
                    <AlertDialog.Description>
                        This Student could not be deleted.
                    </AlertDialog.Description>
                    <Button
                        color="gray"
                        variant="soft"
                        mt="2"
                        onClick={() => setError(false)}
                    >
                        OK
                    </Button>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    );
};

export default DeleteStudentButton;