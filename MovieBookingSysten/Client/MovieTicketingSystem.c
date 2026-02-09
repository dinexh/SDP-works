#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void ticket_booking();
void price_();
void payment(int p);
void cancel_ticket(int p);

int main() {
    int a;
    printf("1. Movie Ticket Booking\n");
    printf("2. Exit\n");
    printf("Select one of the options: ");
    scanf("%d", &a);

    switch (a) {
        case 1:
            ticket_booking();
            break;
        case 2:
            exit(0);
        default:
            printf("Invalid option\n");
    }

    return 0;
}

void ticket_booking() {
    int b;
    printf("\nSelect MOVIE\n\n");
    printf("1. movie1\n2. movie2\n3. movie3\n4. movie4\n");
    scanf("%d", &b);

    switch (b) {
        case 1:
            printf("movie1\n");
            price_();
            break;
        case 2:
            printf("movie2\n");
            price_();
            break;
        case 3:
            printf("movie3\n");
            price_();
            break;
        case 4:
            printf("movie4\n");
            price_();
            break;
        default:
            printf("Invalid option\n");
    }
}

void price_() {
    int n, p, price = 180;
    printf("Enter number of tickets: ");
    scanf("%d", &n);
    p = price * n;
    printf("Price is %d\n", p);
    payment(p);
}

void payment(int p) {
    int k;
    printf("\nSelect payment method\n");
    printf("1. Net Banking\n2. Debit Card\n3. Credit card\n4. Phone Pe\n5. Google pay\n");
    scanf("%d", &k);

    if (k == 6) {
        cancel_ticket(p);
    } else {
        printf("\nYour Payment is Successful\n");
        printf("Booking Details\n");
        printf("Theatre : PVR\n");
        printf("Time : 6:30 First Show\n");
        printf("Price is %d\n", p);
        
        // Ask for confirmation
        printf("\nDo you want to confirm your booking? (1. Confirm, 2. Cancel): ");
        int confirm;
        scanf("%d", &confirm);
        if (confirm == 2) {
            cancel_ticket(p);
        } else {
            printf("\nThank you for your booking!\n");
        }
    }
}

void cancel_ticket(int p) {
    printf("\nYour Ticket has been successfully canceled.\n");
    printf("Refund amount of %d will be processed.\n", p);
}
