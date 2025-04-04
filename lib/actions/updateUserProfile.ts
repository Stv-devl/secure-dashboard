'use server';

import { prisma } from '../prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/authOptions';
import { uploadFileToCloudinary } from '../utils/fileOperations/uploadFileToCloudinary';
import { revalidatePath } from 'next/cache';

interface UserData {
  name: string;
  email: string;
  image?: string;
}

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl: string | null = null;
  if (imageFile && typeof imageFile === 'object') {
    const buffer = await imageFile.arrayBuffer();
    const result = await uploadFileToCloudinary({
      name: imageFile.name,
      type: imageFile.type,
      arrayBuffer: async () => buffer,
    });
    imageUrl = result?.secure_url ?? null;
  }

  //ajouter verification zod

  const userData: UserData = { name, email };
  if (imageUrl) userData.image = imageUrl;

  await prisma.user.update({
    where: { id: session.user.id },
    data: userData,
  });

  revalidatePath('/profile');
}
