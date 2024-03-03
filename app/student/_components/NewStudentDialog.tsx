'use client'
import { Button,  Dialog, Flex} from '@radix-ui/themes'
import React from 'react'
import NewStudent from './NewStudent'

interface Props {
    params: { schoolId: string }
}

const NewStudentDialog = ({ params }: Props) => {
    return (
        <Dialog.Root >
            <Dialog.Trigger>
                <Button variant="surface">Register Student</Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Register Student </Dialog.Title>
                <Flex direction="column" gap="3">
                    <NewStudent params={{ schoolId: params.schoolId }} />
                </Flex>
                <Flex gap="3" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
export default NewStudentDialog