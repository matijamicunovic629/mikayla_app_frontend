import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  useDisclosure,
  
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { toast } from '../lib/toast';
import { Plus, Users } from 'lucide-react';
import { supabase, SocialAccount } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SocialAccountCard } from '../components/SocialAccounts/SocialAccountCard';
import { AddAccountModal } from '../components/SocialAccounts/AddAccountModal';

export const SocialAccountsView = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error loading accounts',
        description: error.message,
        status: 'error',
        
      });
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error removing account',
        description: error.message,
        status: 'error',
        
      });
    } else {
      toast({
        title: 'Account removed',
        status: 'success',
        
      });
      fetchAccounts();
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating account',
        description: error.message,
        status: 'error',
        
      });
    } else {
      toast({
        title: isActive ? 'Account activated' : 'Account deactivated',
        status: 'success',
        
      });
      fetchAccounts();
    }
  };

  const handleSync = async (id: string) => {
    await supabase
      .from('social_accounts')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', id);
    fetchAccounts();
  };

  if (loading) {
    return <Text>Loading accounts...</Text>;
  }

  return (
    <Box>
      <Box mb={8} display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="lg">Social Accounts</Heading>
        <Button leftIcon={<Plus size={20} />} variant="solid" onClick={onOpen}>
          Add Account
        </Button>
      </Box>

      {accounts.length === 0 ? (
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
          <Icon as={Users} w={16} h={16} color="gray.400" />
          <Heading size="md" color="gray.600">
            No social accounts connected
          </Heading>
          <Text color="gray.500" textAlign="center">
            Connect your social media accounts to start managing messages in one place
          </Text>
          <Button variant="solid" onClick={onOpen} mt={4}>
            Connect Your First Account
          </Button>
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {accounts.map((account) => (
            <SocialAccountCard
              key={account.id}
              account={account}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onSync={handleSync}
            />
          ))}
        </SimpleGrid>
      )}

      <AddAccountModal
        isOpen={isOpen}
        onClose={onClose}
        onAccountAdded={fetchAccounts}
      />
    </Box>
  );
};
