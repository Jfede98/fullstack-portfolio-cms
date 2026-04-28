export const mapLinkBlock = (data: any) => {
  return {
    title: data.title,
    description: data.description,
    links: data.link?.map((linkItem: any) => ({
      label: linkItem.label,
      url: linkItem.url,
      isExternal: linkItem.isExternal,
      isButton: linkItem.isButton
    })) || []
  };
};