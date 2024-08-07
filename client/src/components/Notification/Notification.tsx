/* eslint-disable react/no-unstable-nested-components */
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from '@novu/notification-center';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { TTheme } from '@/types/theme';

export default function Notification({
  subscriberId,
  applicationIdentifier,
}: {
  subscriberId: string;
  applicationIdentifier: string;
}) {
  const { theme } = useTheme() as { theme: Exclude<TTheme, 'system'> };
  const navigate = useNavigate();
  const handleNotificationClick = (message: IMessage) => {
    const redirectURL = (message.cta?.data.url ??
      message.payload.redirectURL) as string;
    navigate(redirectURL);
  };
  return (
    <NovuProvider
      subscriberId={subscriberId}
      applicationIdentifier={applicationIdentifier}
      styles={{
        notifications: {
          listItem: {
            layout: {
              fontFamily: 'Noto Sans JP',
              fontSize: '15px',
              textAlign: 'left',
            },
            unread: { fontWeight: 'lighter' },
          },
        },
        header: { title: { fontFamily: 'Noto Sans JP', color: '#db2777' } },
      }}
    >
      <PopoverNotificationCenter
        colorScheme={theme}
        onNotificationClick={handleNotificationClick}
        showUserPreferences={false}
        footer={() => <div className="h-5" />}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
