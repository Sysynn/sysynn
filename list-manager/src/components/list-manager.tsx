import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Plus, Edit, Trash } from "lucide-react";

const API_URL = 'http://localhost:3000';

const ListManager = () => {
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/lessons`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAdd = async () => {
    if (inputValue.trim()) {
      try {
        await fetch(`${API_URL}/lessons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: inputValue.trim() }),
        });
        await fetchItems();
        setInputValue('');
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleEdit = async () => {
    if (inputValue.trim() && selectedIndex !== null) {
      try {
        const item = items[selectedIndex];
        await fetch(`${API_URL}/lessons/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: inputValue.trim() }),
        });
        await fetchItems();
        setInputValue('');
        setIsEditDialogOpen(false);
        setSelectedIndex(null);
      } catch (error) {
        console.error('Error editing item:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedIndex !== null) {
      try {
        const item = items[selectedIndex];
        await fetch(`${API_URL}/lessons/${item.id}`, {
          method: 'DELETE',
        });
        await fetchItems();
        setSelectedIndex(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const moveItem = async (index, direction) => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < items.length - 1)
    ) {
      try {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        await fetch(`${API_URL}/lessons/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldIndex: index,
            newIndex,
          }),
        });
        await fetchItems();
        setSelectedIndex(newIndex);
      } catch (error) {
        console.error('Error moving item:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <Button 
          onClick={() => {
            setInputValue('');
            setIsAddDialogOpen(true);
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>

        <div className="border rounded-lg overflow-hidden">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center p-3 border-b last:border-b-0 ${
                selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="flex-grow">{item.title}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, 'up');
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, 'down');
                  }}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No items yet. Click "Add Lesson" to get started.
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => {
              if (selectedIndex !== null) {
                setInputValue(items[selectedIndex].title);
                setIsEditDialogOpen(true);
              }
            }}
            disabled={selectedIndex === null}
            className="flex-1"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={selectedIndex === null}
            variant="destructive"
            className="flex-1"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter lesson title"
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInputValue('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdd}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter new title"
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInputValue('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEdit}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListManager;