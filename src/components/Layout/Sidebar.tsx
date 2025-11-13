import {
  Box,
  VStack,
  Button,
  Icon,
  Text,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorMode,
  Tooltip,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
} from '@chakra-ui/react';
import {
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Bot,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  MenuIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const Sidebar = ({ activeView, onViewChange, isMobile, isOpen, onClose, onOpen }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const menuItems = [
    { id: 'inbox', label: 'Inbox', icon: MessageSquare },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'ai-config', label: 'AI Assistant', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: string) => {
    onViewChange(view);
    if (isMobile) {
      onClose();
    }
  };

  const SidebarContent = () => (
    <VStack spacing={0} align="stretch" h="full">
      <Flex
        p={6}
        align="center"
        justify="space-between"
        borderBottom="1px"
        borderColor="border.default"
      >
        <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, cyan.500)" bgClip="text">
          FansMetric
        </Text>
        <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            colorScheme="gray"
          />
        </Tooltip>
      </Flex>

      <VStack spacing={1} p={4} flex={1} align="stretch">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            leftIcon={<Icon as={item.icon} />}
            justifyContent="flex-start"
            variant={activeView === item.id ? 'solid' : 'ghost'}
            colorScheme={activeView === item.id ? 'blue' : 'gray'}
            onClick={() => handleNavClick(item.id)}
            size="lg"
            fontWeight="medium"
          >
            {item.label}
          </Button>
        ))}
      </VStack>

      <Box p={4} borderTop="1px" borderColor="border.default">
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            w="full"
            rightIcon={<ChevronDown size={16} />}
          >
            <Flex align="center" gap={3}>
              <Avatar size="sm" name={user?.email} />
              <Box textAlign="left" flex={1} overflow="hidden">
                <Text fontSize="sm" fontWeight="medium" isTruncated>
                  {user?.email}
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<LogOut size={16} />} onClick={signOut}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </VStack>
  );

  if (isMobile) {
    return (
      <>
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          h="60px"
          bg="bg.subtle"
          borderBottom="1px"
          borderColor="border.default"
          align="center"
          px={4}
          zIndex={10}
        >
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon size={20} />}
            onClick={onOpen}
            variant="ghost"
            mr={3}
          />
          <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, cyan.500)" bgClip="text">
            FansMetric
          </Text>
        </Flex>
        <Box h="60px" />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="bg.subtle">
            <DrawerCloseButton />
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      w="260px"
      h="100vh"
      bg="bg.subtle"
      borderRight="1px"
      borderColor="border.default"
      position="fixed"
      left={0}
      top={0}
    >
      <SidebarContent />
    </Box>
  );
};
