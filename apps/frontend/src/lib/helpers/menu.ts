"use server";

import type { TStrapiFooter, TStrapiNavbar } from "@interfaces/lib/menu";
import { getMenu } from "@lib/api/web/menu";
import { CollectionType } from "@lib/constants/state";
import { mapFooter } from "./mappers/footer";
import { mapNavbar } from "./mappers/navbar";

export const getRootMenu = async () =>
  await Promise.all([
    getMenu<TStrapiNavbar>({
      collection: CollectionType.Navbar
    }).then(mapNavbar),
    getMenu<TStrapiFooter>({
      collection: CollectionType.Footer
    }).then(mapFooter)
  ]);
