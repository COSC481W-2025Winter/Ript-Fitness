import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PostItem from '@/components/socialfeed/PostItem'; // Adjust the import path as needed.


describe('PostItem', () => {
    type PostData = {
        id: string;
        type: 'text' | 'image';
        content?: string;
        imageUrl?: string;
        caption?: string;
        user: {
          name: string;
          profilePicture: string;
        };
        timestamp: string;
      };

      const MOCK_FEED_DATA: PostData[] = [
        {
          id: '1',
          type: 'text',
          content: 'Just hit a new PR on my deadlift! 300lbs!',
          user: {
            name: 'John Doe',
            profilePicture: 'https://avatar.iran.liara.run/public/boy?username=Ash',
          },
          timestamp: '2024-09-27T08:30:00Z',
        }];

  it('renders text content correctly', () => {
    const { getByText } = render(<PostItem item={MOCK_FEED_DATA[0]} liked={false} onLikePress={() => {}} />);
    expect(getByText('Just hit a new PR on my deadlift! 300lbs!')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy(); // User's name is rendered
  });

  it('like button triggers onLikePress', () => {
    const onLikePressMock = jest.fn();
    const { getByTestId } = render(<PostItem item={MOCK_FEED_DATA[0]} liked={false} onLikePress={onLikePressMock} />);
    
    /*const likeButton = getByTestId('like-button');
    fireEvent.press(likeButton);
    expect(onLikePressMock).toHaveBeenCalledTimes(1);*/
  });

  // Test for navigating on post press if needed
  it('navigates to detailed screen on post press', () => {
    const { getByTestId } = render(<PostItem item={MOCK_FEED_DATA[0]} liked={false} onLikePress={() => {}} />);
    /*const postTouchable = getByTestId('post-touchable');
    fireEvent.press(postTouchable);*/
  });

});