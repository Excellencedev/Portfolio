import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, Upload } from 'lucide-react';
import ProjectLayout from './ProjectLayout';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: Date;
}

interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Predefined categories
  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other'
  ];

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('expense-tracker-transactions');
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      }));
      setTransactions(parsedTransactions);
    }
  }, []);

  useEffect(() => {
    // Save transactions to localStorage
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!formData.amount || !formData.category || !formData.description) {
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      createdAt: new Date()
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
  };

  const updateTransaction = () => {
    if (!editingTransaction || !formData.amount || !formData.category || !formData.description) {
      return;
    }

    const updatedTransactions = transactions.map(t =>
      t.id === editingTransaction.id
        ? {
            ...t,
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            date: formData.date
          }
        : t
    );

    setTransactions(updatedTransactions);
    setEditingTransaction(null);
    resetForm();
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  // Calculations
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filter === 'all' || t.type === filter;
    const matchesMonth = !selectedMonth || t.date.startsWith(selectedMonth);
    return matchesType && matchesMonth;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  // Category breakdown
  const categoryBreakdown = (): CategorySummary[] => {
    const categories: { [key: string]: { amount: number; count: number } } = {};
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categories[t.category]) {
          categories[t.category] = { amount: 0, count: 0 };
        }
        categories[t.category].amount += t.amount;
        categories[t.category].count += 1;
      });

    return Object.entries(categories)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Monthly data for trends
  const getMonthlyData = (): MonthlyData[] => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          const validTransactions = importedData.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt || Date.now())
          }));
          setTransactions([...transactions, ...validTransactions]);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <ProjectLayout
      title="Expense Tracker"
      description="Personal finance management with analytics and insights"
      githubUrl="https://github.com/yourusername/expense-tracker"
      technologies={["React", "TypeScript", "Local Storage", "Data Visualization", "Tailwind CSS"]}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Amount</p>
                  <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netAmount)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-primary">{filteredTransactions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={20} />
              Add Transaction
            </Button>

            <div className="flex gap-1">
              {(['all', 'income', 'expense'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  onClick={() => setFilter(filterType)}
                  size="sm"
                >
                  {filterType === 'all' ? 'All' : filterType === 'income' ? 'Income' : 'Expenses'}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />

            <Button variant="outline" onClick={exportData}>
              <Download size={16} />
              Export
            </Button>

            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload size={16} />
              Import
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </div>
        </div>

        {/* Add/Edit Transaction Form */}
        {showAddForm && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={editingTransaction ? updateTransaction : addTransaction}>
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                    <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                      Add Your First Transaction
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge
                              className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                            >
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </Badge>
                            <span className="font-medium">{transaction.description}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(transaction)}
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryBreakdown().length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No expense data</p>
                ) : (
                  <div className="space-y-3">
                    {categoryBreakdown().slice(0, 8).map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.count} transaction{item.count !== 1 ? 's' : ''}</span>
                          <span>{item.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {getMonthlyData().length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No trend data available</p>
            ) : (
              <div className="space-y-4">
                {getMonthlyData().map((month) => (
                  <div key={month.month} className="grid grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Month</p>
                      <p className="font-medium">{new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Income</p>
                      <p className="font-medium text-green-600">{formatCurrency(month.income)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expenses</p>
                      <p className="font-medium text-red-600">{formatCurrency(month.expenses)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net</p>
                      <p className={`font-medium ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.net)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default ExpenseTracker;
