import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  useDisclosure,
  
  Text,
  Spinner,
  Flex,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { toast } from '../lib/toast';
import { Inbox as InboxIcon } from 'lucide-react';
import { supabase, Message, MessageReply } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MessageCard } from '../components/Inbox/MessageCard';
import { MessageDetailModal } from '../components/Inbox/MessageDetailModal';
import { InboxFilters } from '../components/Inbox/InboxFilters';

export const InboxView = () => {
  const [messages, setMessages] = useState<(Message & { social_account?: any })[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageReplies, setMessageReplies] = useState<MessageReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    sentiment: 'all',
    search: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  

  useEffect(() => {
    fetchMessages();
  }, [user, filters]);

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    let query = supabase
      .from('messages')
      .select(`
        *,
        social_account:social_accounts(platform, platform_username)
      `)
      .order('platform_created_at', { ascending: false });

    if (filters.status === 'unread') {
      query = query.eq('is_read', false);
    } else if (filters.status === 'unreplied') {
      query = query.eq('is_replied', false);
    } else if (filters.status === 'replied') {
      query = query.eq('is_replied', true);
    }

    if (filters.sentiment !== 'all') {
      query = query.eq('sentiment', filters.sentiment);
    }

    if (filters.search) {
      query = query.ilike('content', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: 'Error loading messages',
        description: error.message,
        status: 'error',
        
      });
    } else {
      let filteredData = data || [];

      if (filters.platform !== 'all') {
        filteredData = filteredData.filter(
          (msg) => msg.social_account?.platform.toLowerCase() === filters.platform.toLowerCase()
        );
      }

      setMessages(filteredData);
    }
    setLoading(false);
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);

    await supabase.from('messages').update({ is_read: true }).eq('id', message.id);

    const { data: replies } = await supabase
      .from('message_replies')
      .select('*')
      .eq('message_id', message.id)
      .order('created_at', { ascending: true });

    setMessageReplies(replies || []);

    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
    );

    onOpen();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const unrepliedCount = messages.filter((m) => !m.is_replied).length;

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex mb={8} justify="space-between" align="center">
        <Box>
          <Heading size="lg">Unified Inbox</Heading>
          <Flex gap={4} mt={2}>
            <Badge colorScheme="red" fontSize="sm" px={2} py={1}>
              {unreadCount} Unread
            </Badge>
            <Badge colorScheme="orange" fontSize="sm" px={2} py={1}>
              {unrepliedCount} Unreplied
            </Badge>
          </Flex>
        </Box>
      </Flex>

      <InboxFilters filters={filters} onFilterChange={handleFilterChange} />

      {messages.length === 0 ? (
        <VStack
          spacing={4}
          py={20}
          px={6}
          bg="gray.50"
          borderRadius="lg"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.300"
        >
          <Icon as={InboxIcon} w={16} h={16} color="gray.400" />
          <Heading size="md" color="gray.600">
            No messages found
          </Heading>
          <Text color="gray.500" textAlign="center">
            Connect your social accounts to start receiving messages
          </Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onClick={() => handleMessageClick(message)}
            />
          ))}
        </VStack>
      )}

      {selectedMessage && (
        <MessageDetailModal
          isOpen={isOpen}
          onClose={onClose}
          message={selectedMessage as any}
          replies={messageReplies}
          onReply={() => {
            fetchMessages();
            if (selectedMessage) {
              handleMessageClick(selectedMessage);
            }
          }}
        />
      )}
    </Box>
  );
};
