import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Plus, Edit, Trash } from "lucide-react";

const ListManager = () => {
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (inputValue.trim() && selectedIndex !== null) {
      const newItems = [...items];
      newItems[selectedIndex] = inputValue.trim();
      setItems(newItems);
      setInputValue('');
      setIsEditDialogOpen(false);
      setSelectedIndex(null);
    }
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const newItems = items.filter((_, index) => index !== selectedIndex);
      setItems(newItems);
      setSelectedIndex(null);
    }
  };

  const moveItem = (index, direction) => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < items.length - 1)
    ) {
      const newItems = [...items];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      setItems(newItems);
      setSelectedIndex(newIndex);
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
              key={index}
              className={`flex items-center p-3 border-b last:border-b-0 ${
                selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="flex-grow">{item}</span>
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
                setInputValue(items[selectedIndex]);
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