import Button from '@/components/button';
import Input from '@/components/input';
import Label from '@/components/label';
import PageHeader from '@/components/page-header';
import Select from '@/components/select';
import Separator from '@/components/separator';
import Skeleton from '@/components/skeleton';
import TransactionItem from '@/components/transaction-item';
import TransactionSummaryItem from '@/components/transaction-summary-item';
import Trend from '@/components/trend';

export const metadata = {
  title: 'PlayGround',
};

export default function Page() {
  return (
    <main className='space-y-8 mb-44'>
      <h1 className='text-4xl mt-8'>Playground</h1>
      <div>
        <h2 className='mb-4 text-lg font-mono'>PageHeader</h2>
        <Separator />
        <div>
          <PageHeader />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>Trend</h2>
        <Separator />
        <div className='flex space-x-8'>
          <Trend type='Income' amount={1000} prevAmount={900} />
          <Trend type='Expense' amount={10} prevAmount={9} />
          <Trend type='Investment' amount={5000} prevAmount={9000} />
          <Trend type='Saving' amount={30000} prevAmount={9000} />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>TransactionItem</h2>
        <Separator />
        <div className='space-y-4'>
          <TransactionItem type='Income' description='salary' amount={2000} />
          <TransactionItem
            type='Expense'
            category='food'
            description='goinng oout to eat'
            amount={29}
          />
          <TransactionItem
            type='Investment'
            description='In Microsoft'
            amount={9000}
          />
          <TransactionItem
            type='Saving'
            description='for children'
            amount={10000}
          />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>
          TransactionSummaryItem + transactionItem
        </h2>
        <Separator />
        <div className='space-y-4'>
          <TransactionSummaryItem date='2024-05-01' amount={3500} />
          <Separator />
          <TransactionItem type='Income' description='salary' amount={2000} />
          <TransactionItem
            type='Expense'
            category='food'
            description='goinng oout to eat'
            amount={29}
          />
          <TransactionItem
            type='Investment'
            description='In Microsoft'
            amount={9000}
          />
          <TransactionItem
            type='Saving'
            description='for children'
            amount={10000}
          />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>Buttons</h2>
        <Separator />
        <div className='space-x-4'>
          <Button>Hello</Button>
          <Button variant='outline'>Hello</Button>
          <Button variant='ghost'>Hello</Button>
          <Button size='xs'>Hello</Button>
          <Button size='sm'>Hello</Button>
          <Button size='lg'>Hello</Button>
          <Button variant='ghost' size='lg'>
            Hello
          </Button>
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>Forms</h2>
        <Separator />
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='mb-1'>Your name</Label>
            <Input type='text' placeholder='type something in here...' />
          </div>
          <div>
            <Label className='mb-1'>City</Label>
            <Select>
              <option value=''>Warsaw</option>
              <option value=''>berlin</option>
              <option value=''>london</option>
            </Select>
          </div>

          <div className='flex items-center'>
            <Input type='checkbox' id='terms' />
            <Label className='ml-2' htmlFor='terms'>
              accept terms
            </Label>
          </div>
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-mono'>Loading Skeleton</h2>
        <Separator />
        <div className='space-y-8'>
          <div className='flex space-x-4'>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>

          <div className='space-y-4'>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
