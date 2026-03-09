import Image from 'next/image';

const TableAvatar = ({ avatar, name }: { avatar: string | null; name: string }) => {
  if (!avatar) {
    return (
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-muted">
        <span className="text-xs font-medium">{String(name).charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Image
        src={avatar}
        alt="avatar"
        width={30}
        height={30}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default TableAvatar;
