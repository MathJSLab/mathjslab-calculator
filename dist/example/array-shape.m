clear
A = [1, 5, 9; 2, 6, 10; 3, 7, 11; 4, 8, 12]
A(:,:,2) = A + 12
reshape(A, 1, 24)
reshape(A, 2, 6, 2)
reshape(A, 3, [], 2)
reshape(A, 2, 3, [])
reshape(A, 4, 4, []) % error
reshape(A, 2, 5, 2) % error
reshape(A, [], 6, []) % error
A = [1, 5, 9; 2, 6, 10; 3, 7, 11; 4, 8, 12]
A(:,:,1,1) = A + 12
A(:,:,1,2) = A + 24
squeeze(A)
