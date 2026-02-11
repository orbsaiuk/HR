import { 
    FileText, 
    Calendar, 
    CheckSquare, 
    Clock, 
    Mail, 
    Hash, 
    Type, 
    AlignLeft, 
    List 
} from 'lucide-react';

// Color palette for response columns
export const columnColors = [
    { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', accent: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', accent: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', accent: 'bg-purple-500', text: 'text-purple-700 dark:text-purple-300' },
    { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', accent: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
    { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800', accent: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
];

// Field type icons mapping
export const fieldTypeIcons = {
    text: Type,
    textarea: AlignLeft,
    number: Hash,
    email: Mail,
    date: Calendar,
    datetime: Calendar,
    time: Clock,
    dropdown: List,
    multipleChoice: CheckSquare,
    file: FileText,
};
